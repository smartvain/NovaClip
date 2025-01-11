import { NextResponse } from 'next/server'
import { requestToKlingAI } from '@/lib/api/klingai'
import { KLINGAI_API_ENDPOINTS } from '@/constants/endpoints'

export async function POST(request: Request) {
  return NextResponse.json({ message: 'Hello, World!' })
  try {
    const body = await request.json()

    const response = await requestToKlingAI(
      KLINGAI_API_ENDPOINTS.IMAGE_TO_VIDEO.CREATE_TASK,
      {
        method: 'POST',
        body: JSON.stringify(body),
      }
    )

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
