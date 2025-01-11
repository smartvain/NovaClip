export const API_ENDPOINTS = {
  IMAGE_TO_VIDEO: {
    CREATE_TASK: '/api/klingai/video/imageToVideo/createTask',
    QUERY_TASK: '/api/klingai/video/imageToVideo/queryTask',
    QUERY_TASK_LIST: '/api/klingai/video/imageToVideo/queryTaskList',
  },
} as const

export const KLINGAI_API_ENDPOINTS = {
  IMAGE_TO_VIDEO: {
    CREATE_TASK: '/v1/videos/image2video',
    QUERY_TASK: '/v1/videos/image2video/{id}', // {id}は呼び出し元でtask_idまたはexternal_task_idに置き換える
    QUERY_TASK_LIST: '/v1/videos/image2videottttt',
  },
} as const
