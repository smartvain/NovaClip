import { CreateTaskParams, TaskResponse } from './types'
import { VALIDATION } from './types'
import { API_ENDPOINTS } from '@/constants/endpoints'
class KlingaiClient {
  private validateCreateTaskParams(params: CreateTaskParams) {
    // プロンプトの長さチェック
    if (params.prompt && params.prompt.length > VALIDATION.MAX_PROMPT_LENGTH) {
      throw new Error(`Prompt length exceeds ${VALIDATION.MAX_PROMPT_LENGTH} characters`)
    }
    if (params.negative_prompt && params.negative_prompt.length > VALIDATION.MAX_PROMPT_LENGTH) {
      throw new Error(`Negative prompt length exceeds ${VALIDATION.MAX_PROMPT_LENGTH} characters`)
    }

    // dynamic_masksのバリデーション
    if (params.dynamic_masks) {
      if (params.dynamic_masks.length > VALIDATION.MAX_DYNAMIC_MASKS) {
        throw new Error(`Maximum ${VALIDATION.MAX_DYNAMIC_MASKS} dynamic masks allowed`)
      }

      params.dynamic_masks.forEach(mask => {
        if (mask.trajectories.length < VALIDATION.MIN_TRAJECTORY_POINTS ||
          mask.trajectories.length > VALIDATION.MAX_TRAJECTORY_POINTS) {
          throw new Error(`Trajectory points must be between ${VALIDATION.MIN_TRAJECTORY_POINTS} and ${VALIDATION.MAX_TRAJECTORY_POINTS}`)
        }
      })
    }

    // cfg_scaleのバリデーション
    if (params.cfg_scale !== undefined &&
      (params.cfg_scale < VALIDATION.CFG_SCALE.MIN || params.cfg_scale > VALIDATION.CFG_SCALE.MAX)) {
      throw new Error(`cfg_scale must be between ${VALIDATION.CFG_SCALE.MIN} and ${VALIDATION.CFG_SCALE.MAX}`)
    }
  }

  async createTaskImageToVideo(params: CreateTaskParams): Promise<TaskResponse> {
    this.validateCreateTaskParams(params)

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

  async checkTaskStatus(taskId: string): Promise<TaskResponse> {
    const response = await fetch(`/api/klingai?taskId=${taskId}`)

    if (!response.ok) {
      throw new Error('Failed to check task status')
    }

    return response.json()
  }
}

export const klingaiClient = new KlingaiClient()
