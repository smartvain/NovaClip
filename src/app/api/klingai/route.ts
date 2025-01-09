import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const API_BASE_URL = 'https://api.klingai.com'
const ACCESS_KEY_ID = process.env.KLINGAI_ACCESS_KEY_ID!
const ACCESS_KEY_SECRET = process.env.KLINGAI_ACCESS_KEY_SECRET!

// JWTトークンを生成する関数
function generateApiToken() {
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

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // APIトークンを生成
    const apiToken = generateApiToken()

    const response = await fetch(`${API_BASE_URL}/v1/videos/image2video`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`,
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// タスクステータスチェック用のエンドポイント
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const taskId = searchParams.get('taskId')

    if (!taskId) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      )
    }

    // APIトークンを生成
    const apiToken = generateApiToken()

    const response = await fetch(`${API_BASE_URL}/v1/videos/tasks/${taskId}`, {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
      },
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
