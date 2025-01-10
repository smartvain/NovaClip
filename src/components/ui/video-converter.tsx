"use client"

import { klingaiClient } from '@/api/klingai'
import { Button } from "@/components/ui/button"
import { useVideoConverter, useImageProcessor } from '@/hooks'
import NextImage from 'next/image'

export function VideoConverter() {
  const [state, actions] = useVideoConverter()

  const { processImage, imageUrl, imagePreviewUrl } = useImageProcessor()

  // ファイル選択時の処理
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const { isValid, error } = await processImage(file)
    if (!isValid && error) {
      alert(error)
    }
  }

  const checkTaskStatus = async (taskId: string) => {
    const status = await klingaiClient.checkTaskStatus(taskId)

    switch (status.status) {
      case 'completed':
        if (status.video_url) {
          actions.setVideoUrl(status.video_url)
          actions.setIsLoading(false)
        }
        return true
      case 'failed':
        actions.setError('動画の生成に失敗しました')
        actions.setIsLoading(false)
        return true
      case 'processing':
        return false
      default:
        actions.setError('不明なステータスです')
        actions.setIsLoading(false)
        return true
    }
  }

  const handleConversion = async () => {
    try {
      actions.setIsLoading(true)
      actions.setError(null)
      actions.setVideoUrl(null)

      const result = await klingaiClient.createImageToVideoTask({
        image: imageUrl || '',
        model_name: "kling-v1-6",
        mode: "std",
        duration: "5",
        prompt: state.prompt,
        negative_prompt: state.negative_prompt,
        cfg_scale: 0.5,
        // 他のオプションパラメータ
      })
      console.log(result)

      // ポーリングで状態を確認
      const pollStatus = async () => {
        const isComplete = await checkTaskStatus(result.task_id)
        if (!isComplete) {
          // 1秒後に再度確認
          setTimeout(pollStatus, 1000)
        }
      }
      await pollStatus()
    } catch (error) {
      console.error('Error:', error)
      actions.setError('エラーが発生しました')
      actions.setIsLoading(false)
    }
  }

  return (
    <div>
      <div>
        <label htmlFor="prompt">Prompt</label>
        <textarea
          value={state.prompt}
          onChange={(e) => actions.setPrompt(e.target.value)}
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
          value={state.negative_prompt}
          onChange={(e) => actions.setNegativePrompt(e.target.value)}
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
          <NextImage
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
        loading={state.isLoading}
        loadingText="生成中..."
        disabled={!imageUrl || state.isLoading}
      >
        動画を生成
      </Button>

      {state.error && (
        <div className="text-red-500 mt-4">
          {state.error}
        </div>
      )}

      {state.isLoading && (
        <div className="mt-4">
          動画を生成中です。しばらくお待ちください...
        </div>
      )}

      {state.videoUrl && (
        <div className="mt-4">
          <h3 className="mb-2">生成された動画:</h3>
          <video
            controls
            autoPlay
            loop
            className="w-full max-w-2xl"
          >
            <source src={state.videoUrl} type="video/mp4" />
            お使いのブラウザは動画の再生に対応していません。
          </video>

          <div className="mt-2">
            <a
              href={state.videoUrl}
              download="generated-video.mp4"
              className="text-blue-500 hover:text-blue-700"
            >
              動画をダウンロード
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
