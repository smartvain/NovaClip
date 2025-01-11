import jwt from 'jsonwebtoken'

const API_BASE_URL = process.env.KLINGAI_API_BASE_URL!
const ACCESS_KEY_ID = process.env.KLINGAI_ACCESS_KEY_ID!
const ACCESS_KEY_SECRET = process.env.KLINGAI_ACCESS_KEY_SECRET!

// reference: https://docs.qingque.cn/d/home/eZQCQxBrX8eeImjK6Ddz5iOi5?identityId=27UO6lWLHd5#section=h.4n2igymyyolq
export function generateJwtToken() {
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
    const token = jwt.sign(payload, ACCESS_KEY_SECRET, {
      algorithm: 'HS256',
      header
    })

    return token
  } catch (error) {
    console.error('JwtToken generation error:', error)
    throw error
  }
}

export function requestToKlingAI(endpoint: string, options?: RequestInit) {
  const apiToken = generateJwtToken()

  return fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options?.headers,
      'Authorization': `Bearer ${apiToken}`,
    },
  })
}
