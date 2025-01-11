"use client"

import { klingaiClient } from '@/api/klingai'
import { Button } from "@/components/ui/button"
import { useImageProcessor } from '@/hooks'
import NextImage from 'next/image'
import { useEffect, useState } from 'react'

export function VideoConverter() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [prompt, setPrompt] = useState<string>('')
  const [negative_prompt, setNegativePrompt] = useState<string>('')

  const { processImage, imageUrl, imagePreviewUrl } = useImageProcessor()

  // ファイル選択時の処理
  const handleSelectImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const { isValid, error } = await processImage(file)
    if (!isValid && error) {
      alert(error)
    }
  }

  const handleQueryTaskList = async () => {
    try {
      const result = await klingaiClient.queryTaskListImageToVideo()

      console.log(result)
      const videoUrl = result.data[0].task_result?.videos[0].url

      if (videoUrl) {
        console.log(videoUrl)
        setVideoUrl(videoUrl)
      }
    } catch (error) {
      console.error('Error:', error)
      setError('エラーが発生しました')
    }
  }


  const handleImageToVideo = async () => {
    try {
      setIsLoading(true)
      setError(null)
      setVideoUrl(null)

      const result = await klingaiClient.createTaskImageToVideo({
        image: imageUrl || '',
        model_name: "kling-v1-6",  // TODO: モデル名をユーザーが選択できるようにする
        mode: "std", // TODO: モードをユーザーが選択できるようにする
        duration: "5", // TODO: ユーザーが選択できるようにする
        prompt: prompt,
        negative_prompt: negative_prompt,
        cfg_scale: 0.5,
      })
      console.log(result)

      // ポーリングで状態を確認
      const pollStatus = async () => {
        const isComplete = await klingaiClient.queryTaskImageToVideo({ task_id: result.data.task_id })
        if (!isComplete) {
          // ５秒ごとに確認
          setTimeout(pollStatus, 5000)
        }
      }
      await pollStatus()
    } catch (error) {
      console.error('Error:', error)
      setError('エラーが発生しました')
      setIsLoading(false)
    }
  }

  const initialPrompt = 'dancing, Create a natural, fluid animation with subtle human-like movements:' +
    '- Maintain gentle, organic motion' +
    '- Add slight breathing movement' +
    '- Include minimal head tilt and micro-expressions' +
    '- Ensure smooth transitions between frames' +
    '- Keep movements delicate and realistic' +
    '- Preserve the original image quality' +
    '- Apply natural motion physics'
  useEffect(() => {
    setPrompt(initialPrompt)
  }, [])

  const initialNegativePrompt = 'nsfw, lowres, (worst quality, bad quality:1.2), bad anatomy, sketch, ' +
    'jpeg artifacts, signature, watermark, old, oldest, censored, bar_censor, ' +
    '(pregnant), chibi, loli, simple background'
  useEffect(() => {
    setNegativePrompt(initialNegativePrompt)
  }, [])

  return (
    <div>
      <Button onClick={handleQueryTaskList}>タスク一覧を取得</Button>

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
          onChange={handleSelectImage}
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '16px'
          }}
        />
        {imagePreviewUrl && (
          <NextImage
            src={imagePreviewUrl}
            alt="Preview"
            width={500}
            height={300}
            style={{
              maxWidth: '100%',
              height: 'auto',
              marginBottom: '16px'
            }}
          />
        )}
      </div>

      <Button
        onClick={handleImageToVideo}
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
  )
}
