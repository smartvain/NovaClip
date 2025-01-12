export interface CreateTaskImageToVideoRequest {
  /** ID of model. Options: video-01 or video-01-live2d */
  model: 'video-01' | 'video-01-live2d'

  /** Description of the video. Must be less than 2000 characters */
  prompt?: string

  /**
   * Default: true
   * If true, the model will automatically optimize the prompt to improve generation quality
   * If false, the model will follow instructions more strictly (recommended for precise control)
   */
  prompt_optimizer?: boolean

  /**
   * First frame image to generate video from.
   * Can be URL or base64 encoded image.
   * Supported formats: JPG, JPEG, PNG
   * Aspect ratio must be between 2:5 and 5:2
   * Shorter side must exceed 300px
   * Max file size: 20MB
   */
  first_frame_image?: string

  /**
   * Optional callback URL for receiving real-time status updates
   * If not needed, omit this parameter and use Query Generation Status API instead
   */
  callback_url?: string
}

export interface CreateTaskImageToVideoResponse {
  /** Task ID for the asynchronous video generation task */
  task_id: string

  /** API response status and details */
  base_resp: {
    status_code: number
    status_msg: string
  }
}
