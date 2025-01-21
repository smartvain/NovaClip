export const API_ROUTE_ENDPOINTS = {
  KLINGAI: {
    IMAGE_TO_VIDEO: {
      CREATE_TASK: '/api/klingai/video/imageToVideo/createTask',
      QUERY_TASK: '/api/klingai/video/imageToVideo/queryTask',
      QUERY_TASK_LIST: '/api/klingai/video/imageToVideo/queryTaskList',
    },
  },
  MINIMAX: {
    IMAGE_TO_VIDEO: {
      CREATE_TASK: '/api/minimax/video/imageToVideo/createTask',
      QUERY_TASK: '/api/minimax/video/imageToVideo/queryTask',
      RETRIEVE_DOWNLOAD_URL: '/api/minimax/video/imageToVideo/retrieveDownloadURL',
    },
  },
} as const

export const KLINGAI_API_ENDPOINTS = {
  IMAGE_TO_VIDEO: {
    CREATE_TASK: '/v1/videos/image2video',
    QUERY_TASK: '/v1/videos/image2video/{id}', // {id}は呼び出し元で置き換える
    QUERY_TASK_LIST: '/v1/videos/image2video',
  },
} as const

export const MINIMAX_API_ENDPOINTS = {
  IMAGE_TO_VIDEO: {
    CREATE_TASK: '/v1/video_generation',
    QUERY_TASK: '/v1/query/video_generation?task_id={task_id}', // {task_id}は呼び出し元で置き換える
    RETRIEVE_DOWNLOAD_URL: '/v1/files/retrieve?GroupId={GroupId}&file_id={file_id}', // {group_id}と{file_id}は呼び出し元で置き換える
  },
} as const
