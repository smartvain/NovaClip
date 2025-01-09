"use client"

import { useState } from 'react';
import { klingaiClient } from '@/api';
import { Button } from "@/components/ui/button"

export function VideoConverter() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('dancing, Create a natural, fluid animation with subtle human-like movements:- Maintain gentle, organic motion- Add slight breathing movement- Include minimal head tilt and micro-expressions- Ensure smooth transitions between frames- Keep movements delicate and realistic- Preserve the original image quality- Apply natural motion physics')
  const [negative_prompt, setNegativePrompt] = useState<string>('nsfw, lowres, (worst quality, bad quality:1.2), bad anatomy, sketch, jpeg artifacts, signature, watermark, old, oldest, censored, bar_censor, (pregnant), chibi, loli, simple background')
  const [imageUrl, setImageUrl] = useState<string>('')
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  // Base64文字列からプレフィックスを削除する関数
  const removeBase64Prefix = (base64String: string): string => {
    // "data:image/jpeg;base64," や "data:image/png;base64," などのプレフィックスを削除
    const base64Prefix = /^data:image\/[a-z]+;base64,/;
    return base64String.replace(base64Prefix, '');
  };

  // 画像のバリデーション
  const validateImage = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const isValidResolution = img.width >= 300 && img.height >= 300;
        const aspectRatio = img.width / img.height;
        const isValidAspectRatio = aspectRatio >= 1/2.5 && aspectRatio <= 2.5;
        const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB

        resolve(isValidResolution && isValidAspectRatio && isValidSize);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  // ファイル選択時の処理
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ファイル形式のチェック
    if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
      alert('JPG または PNG 形式の画像のみ対応しています。');
      return;
    }

    // 画像のバリデーション
    const isValid = await validateImage(file);
    if (!isValid) {
      alert('画像は300x300px以上、アスペクト比1:2.5〜2.5:1の範囲内、10MB以下である必要があります。');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        // プレビュー用にはフルのData URLを使用
        setImagePreviewUrl(reader.result);
        // API送信用には Base64 部分のみを抽出して保存
        setImageUrl(removeBase64Prefix(reader.result));
      }
    };
    reader.readAsDataURL(file);
  };

  const checkTaskStatus = async (taskId: string) => {
    const status = await klingaiClient.checkTaskStatus(taskId);
    
    switch (status.status) {
      case 'completed':
        if (status.video_url) {
          setVideoUrl(status.video_url);
          setIsLoading(false);
        }
        return true;
      case 'failed':
        setError('動画の生成に失敗しました');
        setIsLoading(false);
        return true;
      case 'processing':
        return false;
      default:
        setError('不明なステータスです');
        setIsLoading(false);
        return true;
    }
  };
  
  const handleConversion = async () => {
    try {
        setIsLoading(true);
        setError(null);
        setVideoUrl(null);

        const result = await klingaiClient.createImageToVideoTask({
          image: imageUrl,
          model_name: "kling-v1-6",
          mode: "std",
          duration: "5",
          prompt,
          negative_prompt,
          cfg_scale: 0.5,
          // 他のオプションパラメータ
        });
        console.log(result);

        // ポーリングで状態を確認
        const pollStatus = async () => {
            const isComplete = await checkTaskStatus(result.task_id);
            if (!isComplete) {
            // 1秒後に再度確認
            setTimeout(pollStatus, 1000);
            }
        };
        await pollStatus();
      } catch (error) {
        console.error('Error:', error);
        setError('エラーが発生しました');
        setIsLoading(false);
      }
  };

  return (
    <div>
      <div>
        <label htmlFor="prompt">Prompt</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
          style={{
            width: '100%',
            minHeight: '100px',
            padding: '8px',
            marginBottom: '16px'
          }}
        />
      </div>

      <div>
        <label htmlFor="negative_prompt">Negative Prompt</label>
        <textarea
          value={negative_prompt}
          onChange={(e) => setNegativePrompt(e.target.value)}
          placeholder="Enter your negative prompt here..."
          style={{
            width: '100%',
            minHeight: '100px',
            padding: '8px',
            marginBottom: '16px'
          }}
        />
      </div>

      <div>
        <label htmlFor="image">Image Upload</label>
        <input
          type="file"
          id="image"
          accept="image/jpeg,image/jpg,image/png"
          onChange={handleImageChange}
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '16px'
          }}
        />
        {imagePreviewUrl && (
          <img 
            src={imagePreviewUrl} // プレビュー用にはフルのData URLを使用
            alt="Preview"
            style={{
              maxWidth: '100%',
              marginBottom: '16px'
            }}
          />
        )}
      </div>

      <Button
        onClick={handleConversion}
        loading={isLoading}
        loadingText="生成中..."
        disabled={!imageUrl || isLoading}
      >
        動画を生成
      </Button>

      {error && (
        <div className="text-red-500 mt-4">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="mt-4">
          動画を生成中です。しばらくお待ちください...
        </div>
      )}

      {videoUrl && (
        <div className="mt-4">
          <h3 className="mb-2">生成された動画:</h3>
          <video
            controls
            autoPlay
            loop
            className="w-full max-w-2xl"
          >
            <source src={videoUrl} type="video/mp4" />
            お使いのブラウザは動画の再生に対応していません。
          </video>
          
          <div className="mt-2">
            <a
              href={videoUrl}
              download="generated-video.mp4"
              className="text-blue-500 hover:text-blue-700"
            >
              動画をダウンロード
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
