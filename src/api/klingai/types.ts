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

export interface CreateTaskImageToVideoRequest {
  // 必須フィールド
  image: string;  // Base64文字列またはURL（例: https://example.com/image.jpg）

  // オプションフィールド（推奨設定項目）
  model_name?: ModelName;  // デフォルト: 'kling-v1'
  mode?: VideoMode;        // デフォルト: 'std'
  duration?: Duration;     // デフォルト: '5'
  prompt?: string;         // 動画生成時の指示テキスト
  cfg_scale?: number;      // 0から1の範囲。プロンプトの影響度

  // マスク関連（オプション）
  static_mask?: string;    // 静的マスクのURL
  dynamic_masks?: DynamicMask[];  // 動的マスクの配列

  // その他のオプション
  image_tail?: string;     // 最終フレームの画像URL
  negative_prompt?: string;
  callback_url?: string;   // 処理完了時のコールバックURL
  external_task_id?: string;  // 外部システムでの識別用ID
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
    created_at: number  // Unix timestamp in milliseconds
    updated_at: number  // Unix timestamp in milliseconds
  }
}
