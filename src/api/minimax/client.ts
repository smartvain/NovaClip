import { API_ROUTE_ENDPOINTS } from '@/constants/endpoints'

import { CreateTaskImageToVideoRequest } from './types'

class MinimaxClient {
  async createTaskImageToVideo(params: CreateTaskImageToVideoRequest) {
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

  async queryTaskImageToVideo() {
    // TODO: implement
  }

  async queryTaskListImageToVideo() {
    // TODO: implement
  }
}

export const minimaxClient = new MinimaxClient()
