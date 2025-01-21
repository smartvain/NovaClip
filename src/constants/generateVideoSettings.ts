export const KLING_AI_MODEL_LIST = {
  KLING_V1_6: {
    value: 'kling-v1-6',
    label: 'Kling 1.6',
  },
  KLING_V1_5: {
    value: 'kling-v1-5',
    label: 'Kling 1.5',
  },
  KLING_V1: {
    value: 'kling-v1',
    label: 'Kling 1.0',
  },
} as const
export type KlingModelType = (typeof KLING_AI_MODEL_LIST)[keyof typeof KLING_AI_MODEL_LIST]['value']

export const MINIMAX_MODEL_LIST = {
  VIDEO_01: {
    value: 'video-01',
    label: 'Video 01',
  },
  VIDEO_01_LIVE2D: {
    value: 'video-01-live2d',
    label: 'Video 01 Live2D',
  },
} as const
export type MinimaxModelType = (typeof MINIMAX_MODEL_LIST)[keyof typeof MINIMAX_MODEL_LIST]['value']

export const MODE_LIST = {
  STANDARD: {
    value: 'std',
    label: 'Standard Mode',
  },
  PRO: {
    value: 'pro',
    label: 'Professional Mode',
  },
} as const

export const DURATION_LIST = {
  SHORT: {
    value: '5',
    label: '5s',
  },
  MEDIUM: {
    value: '10',
    label: '10s',
  },
} as const
