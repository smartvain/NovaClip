import { NextResponse } from 'next/server'

import { KLINGAI_API_ENDPOINTS } from '@/constants/endpoints'
import { requestToKlingAI } from '@/lib/api/klingai'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const taskId = searchParams.get('task_id')
    const externalTaskId = searchParams.get('external_task_id')

    // どちらかのIDが必要
    if (!taskId && !externalTaskId) {
      return NextResponse.json(
        { error: 'Either task_id or external_task_id is required' },
        { status: 400 }
      )
    }

    const url = KLINGAI_API_ENDPOINTS.IMAGE_TO_VIDEO.QUERY_TASK.replace(
      '{id}',
      taskId! || externalTaskId!
    )

    const response = await requestToKlingAI(url, { method: 'GET' })

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
