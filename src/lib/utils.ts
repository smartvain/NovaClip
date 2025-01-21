import { KLING_AI_MODEL_LIST, MINIMAX_MODEL_LIST } from '@/constants/generateVideoSettings'
import type { KlingModelType, MinimaxModelType } from '@/constants/generateVideoSettings'

// ... 他のユーティリティ関数 ...

export const isKlingModel = (model: string): model is KlingModelType => {
  return Object.values(KLING_AI_MODEL_LIST).some((m) => m.value === model)
}

export const isMinimaxModel = (model: string): model is MinimaxModelType => {
  return Object.values(MINIMAX_MODEL_LIST).some((m) => m.value === model)
}
