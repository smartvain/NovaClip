import { CreateTaskParams, CreateTaskImageToVideoResponse } from './types'
import { API_ENDPOINTS } from '@/constants/endpoints'
import { validateCreateTaskParams } from '@/lib/api/klingai_validation'

class KlingaiClient {
  async createTaskImageToVideo(params: CreateTaskParams): Promise<CreateTaskImageToVideoResponse> {
    validateCreateTaskParams(params)

    const response = await fetch(API_ENDPOINTS.IMAGE_TO_VIDEO.CREATE_TASK, {
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

  async checkTaskStatus(taskId: string) {
    const response = await fetch(`/api/klingai?taskId=${taskId}`)

    if (!response.ok) {
      throw new Error('Failed to check task status')
    }

    return response.json()
  }
}

export const klingaiClient = new KlingaiClient()
