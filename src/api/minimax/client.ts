import { API_ROUTE_ENDPOINTS } from '@/constants/endpoints'

import {
  CreateTaskImageToVideoRequest,
  CreateTaskImageToVideoResponse,
  QueryTaskImageToVideoRequest,
  QueryTaskImageToVideoResponse,
  RetrieveDownloadURLRequest,
  RetrieveDownloadURLResponse,
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

  async retrieveDownloadURL(
    params: Omit<RetrieveDownloadURLRequest, 'GroupId'>
  ): Promise<RetrieveDownloadURLResponse> {
    const queryParams = new URLSearchParams()
    queryParams.append('file_id', params.file_id)

    const url = `${API_ROUTE_ENDPOINTS.MINIMAX.IMAGE_TO_VIDEO.RETRIEVE_DOWNLOAD_URL}?${queryParams.toString()}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to execute retrieveDownloadURL')
    }

    return response.json()
  }
}

export const minimaxClient = new MinimaxClient()
