// reference: https://intl.minimaxi.com/document/video_generation?key=66d1439376e52fcee2853049#whYrra7nHOP2eZy9yMMbnnU6
export interface CreateTaskImageToVideoRequest {
  model: 'video-01' | 'video-01-live2d'
  prompt?: string
  prompt_optimizer?: boolean
  first_frame_image?: string
  callback_url?: string
}

export interface CreateTaskImageToVideoResponse {
  task_id: string
  base_resp: {
    status_code: number
    status_msg: string
  }
}

// reference: https://intl.minimaxi.com/document/video_generation?key=66d1439376e52fcee2853049#HiFaU52pEy74OrHtdn4Po4ub
export interface QueryTaskImageToVideoRequest {
  task_id: string
}

export interface QueryTaskImageToVideoResponse {
  task_id: string
  status: 'Preparing' | 'Processing' | 'Success' | 'Fail'
  file_id?: string
  base_resp: {
    status_code: number
    status_msg: string
  }
}
