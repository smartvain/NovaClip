import { NextResponse } from 'next/server'
import { requestToKlingAI } from '@/lib/api/klingai'
import { KLINGAI_API_ENDPOINTS } from '@/constants/endpoints'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const pageNum = searchParams.get('pageNum')
    const pageSize = searchParams.get('pageSize')

    const queryParams = new URLSearchParams({
      pageNum: pageNum || '1',
      pageSize: pageSize || '30'
    })

    const url = `${KLINGAI_API_ENDPOINTS.IMAGE_TO_VIDEO.QUERY_TASK_LIST}?${queryParams.toString()}`

    const response = await requestToKlingAI(url, { method: 'GET' })

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
