'use client'

import { useEffect, useState } from 'react'

import { klingaiClient } from '@/api/klingai'
import { PromptTextarea } from '@/components/ui'
import { ImageUploader } from '@/components/ui'
import { MODEL_LIST, MODE_LIST, DURATION_LIST } from '@/constants/generateVideoSettings'
import { useSelectValue } from '@/hooks'
import { useImageProcessor } from '@/hooks'

const initialPrompt =
  'Create a natural, fluid animation with subtle human-like movements:' +
  '- Maintain gentle, organic motion' +
  '- Add slight breathing movement' +
  '- Include minimal head tilt and micro-expressions' +
  '- Ensure smooth transitions between frames' +
  '- Keep movements delicate and realistic' +
  '- Preserve the original image quality' +
  '- Apply natural motion physics'

const initialNegativePrompt =
  'lowres, (worst quality, bad quality:1.2), bad anatomy, sketch, ' +
  'jpeg artifacts, signature, watermark, old, oldest, censored, bar_censor, ' +
  '(pregnant), chibi, loli, simple background'

const LOCAL_STORAGE_KEY = 'klingai_video_urls'

export function VideoConverter() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [videoUrl, setVideoUrl] = useState<string>('')

  // ui
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true)

  // 生成済み動画一覧
  const [videoList, setVideoList] = useState<string[]>([])

  // ユーザー入力項目
  const [prompt, setPrompt] = useState<string>('')
  const [negative_prompt, setNegativePrompt] = useState<string>('')
  const model = useSelectValue(MODEL_LIST.KLING_V1_6.value, MODEL_LIST)
  const mode = useSelectValue(MODE_LIST.STANDARD.value, MODE_LIST)
  const duration = useSelectValue(DURATION_LIST.SHORT.value, DURATION_LIST)
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

  // 画像を削除時の処理
  const handleRemovePreviewImage = () => {
    setImageUrl(null)
    setImagePreviewUrl(null)
    const input = document.getElementById('image') as HTMLInputElement
    if (input) input.value = ''
  }

  // 生成済みの動画一覧を取得
  const handleQueryTaskList = async () => {
    try {
      const cachedUrls = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (cachedUrls) {
        setVideoList(JSON.parse(cachedUrls))
        return
      }

      const result = await klingaiClient.queryTaskListImageToVideo()
      console.log('result: ', result)
      const videoUrls = result.data
        .map((task) => task.task_result?.videos?.[0].url || '')
        .filter((url) => url !== '')

      if (videoUrls && videoUrls.length > 0) {
        setVideoList(videoUrls)
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(videoUrls))
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  // 画像から動画を生成
  const handleGenerateVideoFromImage = async () => {
    try {
      setIsLoading(true)
      setError('')
      setVideoUrl('')

      const params = {
        image: imageUrl || '',
        model_name: model.value,
        mode: mode.value,
        duration: duration.value,
        prompt: `${prompt}, ${initialPrompt}`,
        negative_prompt: `${negative_prompt}, ${initialNegativePrompt}`,
        cfg_scale: 0.5,
      }

      const result = await klingaiClient.createTaskImageToVideo(params)

      // ポーリングで状態を確認
      const pollStatus = async () => {
        const queryTaskImageToVideoResponse = await klingaiClient.queryTaskImageToVideo({
          task_id: result.data.task_id,
        })

        console.log('queryTaskImageToVideoResponse: ', queryTaskImageToVideoResponse)

        const isComplete = queryTaskImageToVideoResponse.data.task_status === 'succeed'

        if (!isComplete) {
          // ５秒ごとに確認
          setTimeout(pollStatus, 5000)
        } else {
          const videoUrl = queryTaskImageToVideoResponse.data.task_result?.videos?.[0].url || ''
          setVideoUrl(videoUrl)
        }
      }
      await pollStatus()
    } catch (error) {
      console.error('Error:', error)
      setError('エラーが発生しました')
      setIsLoading(false)
    } finally {
      setIsLoading(false)
      console.log('動画生成が完了しました')
    }
  }

  useEffect(() => {
    handleQueryTaskList()
  }, [])

  return (
    <div className="flex h-full overflow-hidden">
      <div className="w-[450px] flex-shrink-0 p-4 border-r flex flex-col">
        <div className="flex-grow overflow-y-auto scrollbar-none">
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

          <div className="mt-4">
            <details className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <summary className="font-medium cursor-pointer">Settings</summary>

              <div className="mt-4">
                <label htmlFor="model" className="block mb-2">
                  Model
                </label>
                <select
                  id="model"
                  value={model.value}
                  onChange={model.onChange}
                  className="w-full p-2 border rounded"
                >
                  {Object.entries(MODEL_LIST).map(([key, value]) => (
                    <option key={key} value={value.value}>
                      {value.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-4">
                <label htmlFor="mode" className="block mb-2">
                  Mode
                </label>
                <select
                  id="mode"
                  value={mode.value}
                  onChange={mode.onChange}
                  className="w-full p-2 border rounded"
                >
                  {Object.entries(MODE_LIST).map(([key, value]) => (
                    <option key={key} value={value.value}>
                      {value.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-4">
                <label htmlFor="duration" className="block mb-2">
                  Duration
                </label>
                <select
                  id="duration"
                  value={duration.value}
                  onChange={duration.onChange}
                  className="w-full p-2 border rounded"
                >
                  {Object.entries(DURATION_LIST).map(([key, value]) => (
                    <option key={key} value={value.value}>
                      {value.label}
                    </option>
                  ))}
                </select>
              </div>
            </details>
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={handleGenerateVideoFromImage}
            disabled={!imageUrl || isLoading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Generate
          </button>
        </div>
      </div>

      <div className="flex-grow p-4 overflow-y-auto">
        {error && <div className="text-red-500 mt-4">{error}</div>}

        {isLoading && <div className="mt-4">動画を生成中です。しばらくお待ちください...</div>}

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm h-[600px]">
          <div className="relative rounded-lg overflow-hidden bg-black h-full">
            {videoUrl && (
              <>
                <button
                  onClick={() => setVideoUrl('')}
                  className="absolute top-2 right-2 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
                <video
                  key={videoUrl}
                  controls
                  autoPlay
                  loop
                  className="w-full max-w-2xl mx-auto h-full"
                >
                  <source src={videoUrl} type="video/mp4" />
                  Your browser does not support video playback.
                </video>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="h-8 w-4 bg-gray-100 hover:bg-gray-200 flex items-center justify-center self-center rounded-l"
        >
          <span className="transform rotate-90 text-gray-500 text-sm">
            {isSidebarOpen ? '▼' : '▲'}
          </span>
        </button>

        <div
          className={`
            transition-all duration-300 ease-in-out
            ${isSidebarOpen ? 'w-[200px]' : 'w-0'}
            flex-shrink-0 border-l overflow-hidden h-full
          `}
        >
          <div className="p-4 w-[200px] h-full overflow-y-auto">
            {videoList.map((videoUrl, index) => (
              <div key={index} className="mb-4">
                <video
                  className="w-full h-auto rounded-lg cursor-pointer"
                  preload="metadata"
                  muted
                  playsInline
                  onClick={() => setVideoUrl(videoUrl)}
                  onMouseOver={(e) => e.currentTarget.play()}
                  onMouseOut={(e) => {
                    e.currentTarget.pause()
                    e.currentTarget.currentTime = 0
                  }}
                >
                  <source src={videoUrl} type="video/mp4" />
                </video>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
