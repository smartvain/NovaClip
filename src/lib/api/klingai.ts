import jwt from 'jsonwebtoken'

const API_BASE_URL = process.env.KLINGAI_API_BASE_URL!
const ACCESS_KEY_ID = process.env.KLINGAI_ACCESS_KEY_ID!
const ACCESS_KEY_SECRET = process.env.KLINGAI_ACCESS_KEY_SECRET!

export function generateApiToken() {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  }

  const payload = {
    iss: ACCESS_KEY_ID,
    // 有効期限を30分後に設定
    exp: Math.floor(Date.now() / 1000) + 1800,
    // トークンの有効開始時間を5秒前に設定
    nbf: Math.floor(Date.now() / 1000) - 5
  }

  try {
    // デバッグ用のログ出力
    console.log('Generating token with:', {
      accessKeyId: ACCESS_KEY_ID,
      payload
    })

    const token = jwt.sign(payload, ACCESS_KEY_SECRET, {
      algorithm: 'HS256',
      header
    })

    return token
  } catch (error) {
    console.error('Token generation error:', error)
    throw error
  }
}

export function customFetch(url: string, options?: RequestInit) {
  const apiToken = generateApiToken()

  return fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      ...options?.headers,
      'Authorization': `Bearer ${apiToken}`,
    },
  })
}
