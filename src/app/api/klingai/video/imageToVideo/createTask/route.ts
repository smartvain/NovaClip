import { NextResponse } from 'next/server'

import { KLINGAI_API_ENDPOINTS } from '@/constants/endpoints'
import { requestToKlingAI } from '@/lib/api/klingai'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const response = await requestToKlingAI(KLINGAI_API_ENDPOINTS.IMAGE_TO_VIDEO.CREATE_TASK, {
      method: 'POST',
      body: JSON.stringify(body),
    })

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
