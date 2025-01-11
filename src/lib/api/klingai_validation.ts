import { CreateTaskImageToVideoRequest } from "@/api/klingai/types"

export const VALIDATION = {
  MAX_PROMPT_LENGTH: 2500,
  MAX_DYNAMIC_MASKS: 6,
  MAX_TRAJECTORY_POINTS: 77,
  MIN_TRAJECTORY_POINTS: 2,
  MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
  MIN_IMAGE_RESOLUTION: 300, // 300x300px
  MAX_ASPECT_RATIO: 2.5,
  MIN_ASPECT_RATIO: 1 / 2.5,
  CFG_SCALE: {
    MIN: 0,
    MAX: 1
  }
} as const

export const validateCreateTaskImageToVideo = (params: CreateTaskImageToVideoRequest) => {
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
