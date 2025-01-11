'use client'

import { useState } from 'react'

import { klingaiClient } from '@/api/klingai'
import { PromptTextarea } from '@/components/ui'
import { ImageUploader } from '@/components/ui'
import { Button } from '@/components/ui/button'
import { useImageProcessor } from '@/hooks'

const initialPrompt =
  'dancing, Create a natural, fluid animation with subtle human-like movements:' +
  '- Maintain gentle, organic motion' +
  '- Add slight breathing movement' +
  '- Include minimal head tilt and micro-expressions' +
  '- Ensure smooth transitions between frames' +
  '- Keep movements delicate and realistic' +
  '- Preserve the original image quality' +
  '- Apply natural motion physics'

const initialNegativePrompt =
  'nsfw, lowres, (worst quality, bad quality:1.2), bad anatomy, sketch, ' +
  'jpeg artifacts, signature, watermark, old, oldest, censored, bar_censor, ' +
  '(pregnant), chibi, loli, simple background'

export function VideoConverter() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [videoUrl, setVideoUrl] = useState<string>('')
  const [prompt, setPrompt] = useState<string>(initialPrompt)
  const [negative_prompt, setNegativePrompt] = useState<string>(initialNegativePrompt)

  const { processImage, imageUrl, imagePreviewUrl, setImageUrl, setImagePreviewUrl } =
    useImageProcessor()

  // ファイル選択時の処理
  const handleSelectImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const { isValid, error } = await processImage(file)
    if (!isValid && error) {
      alert(error)
    }
  }

  const handleRemovePreviewImage = () => {
    setImageUrl(null)
    setImagePreviewUrl(null)
    // ファイル選択をクリア
    const input = document.getElementById('image') as HTMLInputElement
    if (input) input.value = ''
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

  const handleGenerateVideoFromImage = async () => {
    try {
      setIsLoading(true)
      setError(null)
      setVideoUrl(null)

      const result = await klingaiClient.createTaskImageToVideo({
        image: imageUrl || '',
        model_name: 'kling-v1-6', // TODO: モデル名をユーザーが選択できるようにする
        mode: 'std', // TODO: モードをユーザーが選択できるようにする
        duration: '5', // TODO: ユーザーが選択できるようにする
        prompt: prompt,
        negative_prompt: negative_prompt,
        cfg_scale: 0.5,
      })
      console.log(result)

      // ポーリングで状態を確認
      const pollStatus = async () => {
        const isComplete = await klingaiClient.queryTaskImageToVideo({
          task_id: result.data.task_id,
        })
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

  return (
    <div className="flex">
      <div className="w-[400px] flex-shrink-0 p-4 border-r h-screen flex flex-col">
        <div className="flex-grow overflow-y-auto">
          {/* ポジティブプロンプト */}
          <PromptTextarea
            label="Prompt"
            value={prompt}
            onChange={setPrompt}
            placeholder="Enter your prompt here..."
          />
          {/* ネガティブプロンプト */}
          <PromptTextarea
            className="mt-4"
            label="Negative Prompt"
            value={negative_prompt}
            onChange={setNegativePrompt}
            placeholder="Enter your negative prompt here..."
          />
          {/* 画像アップロード */}
          <ImageUploader
            className="mt-4"
            onSelectImage={handleSelectImage}
            onRemoveImage={handleRemovePreviewImage}
            imagePreviewUrl={imagePreviewUrl}
          />
        </div>

        <div className="mt-4">
          <Button
            onClick={handleGenerateVideoFromImage}
            loading={isLoading}
            loadingText="Generating..."
            disabled={!imageUrl || isLoading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Generate
          </Button>
        </div>
      </div>

      <div className="flex-grow p-4">
        {error && <div className="text-red-500 mt-4">{error}</div>}

        {isLoading && <div className="mt-4">動画を生成中です。しばらくお待ちください...</div>}

        {videoUrl && (
          <div className="mt-4">
            <h3 className="mb-2">生成された動画:</h3>
            <video controls autoPlay loop className="w-full max-w-2xl">
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
    </div>
  )
}
