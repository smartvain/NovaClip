// 動的マスクの軌跡の座標を定義
interface Trajectory {
  x: number
  y: number
}

// 動的マスクの設定を定義
interface DynamicMask {
  mask: string  // Base64文字列またはURL
  trajectories: Trajectory[]
}

// モデル名の列挙型
type ModelName = 'kling-v1' | 'kling-v1-5' | 'kling-v1-6'

// ビデオモードの列挙型
type VideoMode = 'std' | 'pro'

// 動画の長さの列挙型
type Duration = '5' | '10'

type TaskInfo = {
  task_id: string
  task_status: 'submitted' | 'processing' | 'succeed' | 'failed'
  task_status_msg: string
  task_info: {
    external_task_id: string
  }
  created_at: number
  updated_at: number
  task_result?: { // Optional because it might not be present for non-completed tasks
    videos: {
      id: string
      url: string
      duration: string
    }[]
  }
}

// reference: https://docs.qingque.cn/d/home/eZQCQxBrX8eeImjK6Ddz5iOi5?identityId=27UO6lWLHd5#section=h.ywnd1ev4itb6
export interface CreateTaskImageToVideoRequest {
  // 必須フィールド
  image: string  // Base64文字列またはURL
  // オプションフィールド（推奨設定項目）
  model_name?: ModelName
  mode?: VideoMode
  duration?: Duration
  prompt?: string
  cfg_scale?: number
  // マスク関連（オプション）
  static_mask?: string
  dynamic_masks?: DynamicMask[]
  // その他のオプション
  image_tail?: string // 最終フレームの画像URL
  negative_prompt?: string
  callback_url?: string // 処理完了時のコールバックURL
  external_task_id?: string // 外部システムでの識別用ID
}

// reference: https://docs.qingque.cn/d/home/eZQCQxBrX8eeImjK6Ddz5iOi5?identityId=27UO6lWLHd5#section=h.8u8yii97vg00
export interface CreateTaskImageToVideoResponse {
  code: number
  message: string
  request_id: string
  data: {
    task_id: string
    task_status: 'submitted' | 'processing' | 'succeed' | 'failed'
    task_info: {
      external_task_id: string
    }
    created_at: number
    updated_at: number
  }
}

// reference: https://docs.qingque.cn/d/home/eZQCQxBrX8eeImjK6Ddz5iOi5?identityId=27UO6lWLHd5#section=h.tctihnoe3rnc
export interface QueryTaskImageToVideoRequest {
  task_id?: string
  external_task_id?: string
}

// reference: https://docs.qingque.cn/d/home/eZQCQxBrX8eeImjK6Ddz5iOi5?identityId=27UO6lWLHd5#section=h.n8uvkpnxs0rn
export interface QueryTaskImageToVideoResponse {
  code: number
  message: string
  request_id: string
  data: TaskInfo
}

// reference: https://docs.qingque.cn/d/home/eZQCQxBrX8eeImjK6Ddz5iOi5?identityId=27UO6lWLHd5#section=h.hdxuzha3meuf
export interface QueryTaskListImageToVideoRequest {
  pageNum?: string
  pageSize?: string
}

// reference: https://docs.qingque.cn/d/home/eZQCQxBrX8eeImjK6Ddz5iOi5?identityId=27UO6lWLHd5#section=h.utrk3vv5qghv
export interface QueryTaskListImageToVideoResponse {
  code: number
  message: string
  request_id: string
  data: TaskInfo[]  // Changed to array as the JSON shows data is an array
}
