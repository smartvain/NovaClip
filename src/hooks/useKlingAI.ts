import { useState } from 'react'

import { klingaiClient } from '@/api/klingai'
import { CreateTaskImageToVideoRequest } from '@/api/klingai'
import { useToast } from '@/components/ui'

const LOCAL_STORAGE_KEY = 'klingai_video_urls'

export const useKlingAI = (setIsLoading: (isLoading: boolean) => void) => {
  const [videoUrl, setVideoUrl] = useState<string>('')
  const [videoList, setVideoList] = useState<string[]>([])

  const { showToast } = useToast()

  const handleKlingGenerateVideoFromImage = async (params: CreateTaskImageToVideoRequest) => {
    try {
      setIsLoading(true)

      const result = await klingaiClient.createTaskImageToVideo(params)

      pollStatus(result.data.task_id)
    } catch (error) {
      console.error(error)
      showToast('Failed to generate video', 'error')
    } finally {
      setIsLoading(false)
    }
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

  return {
    handleKlingGenerateVideoFromImage,
    handleQueryTaskList,
    videoUrl,
    videoList,
    setVideoUrl,
  }
}
