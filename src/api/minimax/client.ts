import { API_ROUTE_ENDPOINTS } from '@/constants/endpoints'

import {
  CreateTaskImageToVideoRequest,
  CreateTaskImageToVideoResponse,
  QueryTaskImageToVideoRequest,
  QueryTaskImageToVideoResponse,
} from './types'

class MinimaxClient {
  async createTaskImageToVideo(
    params: CreateTaskImageToVideoRequest
  ): Promise<CreateTaskImageToVideoResponse> {
    const response = await fetch(API_ROUTE_ENDPOINTS.MINIMAX.IMAGE_TO_VIDEO.CREATE_TASK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      throw new Error('Failed to execute createTaskImageToVideo')
    }

    return response.json()
  }

  async queryTaskImageToVideo(
    params: QueryTaskImageToVideoRequest
  ): Promise<QueryTaskImageToVideoResponse> {
    if (!params.task_id) {
      throw new Error('Task_id is required')
    }

    const queryParams = new URLSearchParams()
    queryParams.append('task_id', params.task_id)

    const url = `${API_ROUTE_ENDPOINTS.MINIMAX.IMAGE_TO_VIDEO.QUERY_TASK}?${queryParams.toString()}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to execute queryTaskImageToVideo')
    }

    return response.json()
  }

  async queryTaskListImageToVideo() {
    // TODO: implement
  }
}

export const minimaxClient = new MinimaxClient()
