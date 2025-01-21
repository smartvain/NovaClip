import { NextResponse } from 'next/server'

import { MINIMAX_API_ENDPOINTS } from '@/constants/endpoints'
import { requestToMinimax } from '@/lib/api/minimax/common'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const taskId = searchParams.get('task_id')

    if (!taskId) {
      return NextResponse.json({ error: 'Either task_id is required' }, { status: 400 })
    }

    const url = MINIMAX_API_ENDPOINTS.IMAGE_TO_VIDEO.QUERY_TASK.replace('{task_id}', taskId!)

    const response = await requestToMinimax(url, { method: 'GET' })

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
