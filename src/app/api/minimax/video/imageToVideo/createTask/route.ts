import { NextResponse } from 'next/server'

import { MINIMAX_API_ENDPOINTS } from '@/constants/endpoints'
import { requestToMinimax } from '@/lib/api/minimax/common'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('request body:', body)

    // const response = await requestToMinimax(MINIMAX_API_ENDPOINTS.IMAGE_TO_VIDEO.CREATE_TASK, {
    //   method: 'POST',
    //   body: JSON.stringify(body),
    // })

    // const data = await response.json()

    // return NextResponse.json(data)
    return NextResponse.json({ message: 'test' })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
