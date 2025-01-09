// 動的マスクの軌跡の座標を定義
interface Trajectory {
  x: number;
  y: number;
}

// 動的マスクの設定を定義
interface DynamicMask {
  mask: string;  // Base64文字列またはURL
  trajectories: Trajectory[];
}

// モデル名の列挙型
type ModelName = 'kling-v1' | 'kling-v1-5' | 'kling-v1-6';

// ビデオモードの列挙型
type VideoMode = 'std' | 'pro';

// 動画の長さの列挙型
type Duration = '5' | '10';

export interface CreateTaskParams {
  // 必須フィールド
  image: string;  // Base64文字列またはURL

  // オプションフィールド
  model_name?: ModelName;
  image_tail?: string;
  prompt?: string;
  negative_prompt?: string;
  cfg_scale?: number;  // 0から1の範囲
  mode?: VideoMode;
  static_mask?: string;
  dynamic_masks?: DynamicMask[];
  duration?: Duration;
  callback_url?: string;
  external_task_id?: string;
}

// バリデーション用の定数
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
} as const;

export interface TaskResponse {
  task_id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  video_url?: string
  error?: {
    message: string
    code: string
  }
}
