'use client'

import { useEffect, useState } from 'react'

import {
  PromptTextarea,
  ImageUploader,
  SelectField,
  VideoDisplay,
  VideoSidebar,
} from '@/components/ui'
import {
  KLING_AI_MODEL_LIST,
  MINIMAX_MODEL_LIST,
  MODE_LIST,
  DURATION_LIST,
} from '@/constants/generateVideoSettings'
import { useSelectValue, useImageProcessor, useMinimax, useKlingAI, usePrompt } from '@/hooks'
import { isKlingModel } from '@/lib/utils'

const ALL_MODELS = { ...KLING_AI_MODEL_LIST, ...MINIMAX_MODEL_LIST }

export function VideoConverter() {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // ui
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true)

  // ユーザー入力項目
  const {
    prompt,
    negativePrompt,
    setPrompt,
    setNegativePrompt,
    atatchInitialPrompt,
    atatchInitialNegativePrompt,
  } = usePrompt()

  const model = useSelectValue(MINIMAX_MODEL_LIST.VIDEO_01_LIVE2D.value, ALL_MODELS)
  const mode = useSelectValue(MODE_LIST.STANDARD.value, MODE_LIST)
  const duration = useSelectValue(DURATION_LIST.SHORT.value, DURATION_LIST)

  const {
    processImageForKling,
    processImageForMinimax,
    imageUrl,
    imagePreviewUrl,
    handleRemovePreviewImage,
  } = useImageProcessor()

  const { handleQueryTaskForMinimax, handleMinimaxGenerateVideoFromImage } =
    useMinimax(setIsLoading)

  const {
    handleKlingGenerateVideoFromImage,
    handleQueryTaskList,
    videoList,
    videoUrl,
    setVideoUrl,
  } = useKlingAI(setIsLoading)

  const handleSelectImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const { isValid, error } = isKlingModel(model.value)
      ? await processImageForKling(file)
      : await processImageForMinimax(file)

    if (!isValid && error) {
      alert(error)
    }
  }

  const handleGenerateVideo = () => {
    if (isKlingModel(model.value)) {
      const params = {
        image: imageUrl || '',
        model_name: model.value,
        mode: mode.value,
        duration: duration.value,
        prompt: atatchInitialPrompt(prompt),
        negative_prompt: atatchInitialNegativePrompt(negativePrompt),
        cfg_scale: 0.5,
      }
      handleKlingGenerateVideoFromImage(params)
    } else {
      const params = {
        first_frame_image: imageUrl || '',
        model: model.value,
        prompt: atatchInitialPrompt(prompt),
      }
      handleMinimaxGenerateVideoFromImage(params)
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
            value={negativePrompt}
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
                options={ALL_MODELS}
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
            onClick={handleGenerateVideo}
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

      <div className="flex">
        <VideoSidebar
          isOpen={isSidebarOpen}
          isLoading={isLoading}
          videoList={videoList}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          onRefresh={() => handleQueryTaskForMinimax()}
          onSelectVideo={setVideoUrl}
        />
      </div>
    </div>
  )
}
