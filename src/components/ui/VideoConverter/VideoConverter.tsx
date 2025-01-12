'use client'

import { useEffect, useState } from 'react'

import { klingaiClient } from '@/api/klingai'
import {
  PromptTextarea,
  ImageUploader,
  SelectField,
  VideoDisplay,
  VideoSidebar,
  useToast,
} from '@/components/ui'
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

  const { showToast } = useToast()

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
  const handleQueryTaskList = async (isCache: boolean = false) => {
    try {
      setIsLoading(true)

      const cachedUrlsText = isCache ? localStorage.getItem(LOCAL_STORAGE_KEY) : null
      if (cachedUrlsText) {
        setVideoList(JSON.parse(cachedUrlsText))
        return
      }

      const result = await klingaiClient.queryTaskListImageToVideo()

      const videoUrls = result.data
        .map((task) => task.task_result?.videos?.[0].url || '')
        .filter((url) => url !== '')

      if (videoUrls && videoUrls.length > 0) {
        setVideoList(videoUrls)
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(videoUrls))
      }
      showToast('Video list updated successfully', 'info')
    } catch (error) {
      console.error(error)
      showToast('Failed to fetch video list', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  // 画像から動画を生成
  const handleGenerateVideoFromImage = async () => {
    try {
      setIsLoading(true)

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

      pollStatus(result.data.task_id)
    } catch (error) {
      console.error(error)
      showToast('Failed to generate video', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  // ポーリング処理
  const pollStatus = async (taskId: string) => {
    try {
      const response = await klingaiClient.queryTaskImageToVideo({
        task_id: taskId,
      })

      const isComplete = response.data.task_status === 'succeed'
      const isFailed = response.data.task_status === 'failed' // エラー状態の確認を追加

      if (isFailed) {
        setIsLoading(false)
        return
      }

      if (!isComplete) {
        // ５秒後に再度確認
        setTimeout(() => pollStatus(taskId), 5000)
      } else {
        const videoUrl = response.data.task_result?.videos?.[0].url || ''
        setVideoUrl(videoUrl)
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Polling error:', error)
      showToast('Failed to generate video', 'error')
      setIsLoading(false)
    }
  }

  useEffect(() => {
    handleQueryTaskList(true)
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

              <SelectField
                id="model"
                label="Model"
                value={model.value}
                onChange={model.onChange}
                options={MODEL_LIST}
                className="mt-4"
              />

              <SelectField
                id="mode"
                label="Mode"
                value={mode.value}
                onChange={mode.onChange}
                options={MODE_LIST}
                className="mt-4"
              />

              <SelectField
                id="duration"
                label="Duration"
                value={duration.value}
                onChange={duration.onChange}
                options={DURATION_LIST}
                className="mt-4"
              />
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
        <VideoDisplay videoUrl={videoUrl} isLoading={isLoading} onClose={() => setVideoUrl('')} />
      </div>

      <div>
        <VideoSidebar
          isOpen={isSidebarOpen}
          isLoading={isLoading}
          videoList={videoList}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          onRefresh={() => handleQueryTaskList()}
          onSelectVideo={setVideoUrl}
        />
      </div>
    </div>
  )
}
