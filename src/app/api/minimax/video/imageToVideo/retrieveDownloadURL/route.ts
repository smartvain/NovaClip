import { NextResponse } from 'next/server'

import { MINIMAX_API_ENDPOINTS } from '@/constants/endpoints'
import { requestToMinimax } from '@/lib/api/minimax/common'

const MINIMAX_GROUP_ID = process.env.MINIMAX_GROUP_ID

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const fileId = searchParams.get('file_id')

    if (!fileId) {
      return NextResponse.json({ error: 'file_id is required' }, { status: 400 })
    }
    if (!MINIMAX_GROUP_ID) {
      return NextResponse.json({ error: 'GroupId is required' }, { status: 400 })
    }

    const url = MINIMAX_API_ENDPOINTS.IMAGE_TO_VIDEO.RETRIEVE_DOWNLOAD_URL.replace(
      '{file_id}',
      fileId!
    ).replace('{GroupId}', MINIMAX_GROUP_ID!)

    const response = await requestToMinimax(url, { method: 'GET' })

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
