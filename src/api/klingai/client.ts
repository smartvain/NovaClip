import {
  CreateTaskImageToVideoRequest,
  CreateTaskImageToVideoResponse,
  QueryTaskListImageToVideoRequest,
  QueryTaskListImageToVideoResponse
} from './types'
import { API_ENDPOINTS } from '@/constants/endpoints'
import { validateCreateTaskImageToVideo } from '@/lib/api/klingai_validation'

class KlingaiClient {
  async createTaskImageToVideo(params: CreateTaskImageToVideoRequest): Promise<CreateTaskImageToVideoResponse> {
    validateCreateTaskImageToVideo(params)

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

  async queryTaskListImageToVideo(params: QueryTaskListImageToVideoRequest): Promise<QueryTaskListImageToVideoResponse> {
    const queryParams = new URLSearchParams({
      pageNum: params.pageNum || '1',
      pageSize: params.pageSize || '30',
    })

    const url = `${API_ENDPOINTS.IMAGE_TO_VIDEO.QUERY_TASK_LIST}?${queryParams.toString()}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to execute queryTaskListImageToVideo')
    }

    return response.json()
  }
}

export const klingaiClient = new KlingaiClient()
