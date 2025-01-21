import { useState } from 'react'

import { CreateTaskImageToVideoRequest, minimaxClient } from '@/api/minimax'
import { useToast } from '@/components/ui'
import { MINIMAX_BASE_RESP_STATUS_CODES, MINIMAX_TASK_STATUS_CODES } from '@/constants/api'
import { setCookieAction } from '@/lib/cookies'

// const TASK_IDS = [
//   '227075836317832',
//   '228333020074223',
//   '228336569786500',
//   '228337141276802',
//   '228386605830352',
// ]

// const STORAGE_KEY = 'minimax_task_ids'

export const useMinimax = (setIsLoading: (isLoading: boolean) => void) => {
  const [taskId, setTaskId] = useState<string>('')
  const [fileId, setFileId] = useState<string>('')
  const [downloadUrl, setDownloadUrl] = useState<string>('')

  const { showToast } = useToast()

  const handleGenerateVideoFromImage = async (params: CreateTaskImageToVideoRequest) => {
    try {
      setIsLoading(true)

      const response = await minimaxClient.createTaskImageToVideo(params)

      await setCookieAction({
        name: 'minimax_task_info',
        value: JSON.stringify(response),
        maxAge: 30 * 60, // 30分
      })

      setTaskId(response.task_id)

      pollStatus(response.task_id)
    } catch (error) {
      console.error(error)
      showToast('Failed to generate video', 'error')

      setIsLoading(false)
    }
  }

  const handleQueryTask = async (taskId: string) => {
    try {
      setIsLoading(true)

      const result = await minimaxClient.queryTaskImageToVideo({ task_id: taskId })

      if (result.base_resp.status_code !== MINIMAX_BASE_RESP_STATUS_CODES.SUCCESS) return
      const fileId = result.file_id || ''

      setTaskId(result.task_id)
      setFileId(fileId)

      await handleRetrieveDownloadURL(fileId)
    } catch (error) {
      console.error(error)
      showToast('Failed to fetch a task', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetrieveDownloadURL = async (fileId: string) => {
    const errorMessage = 'Failed to retrieve download URL'

    if (!fileId) {
      showToast(errorMessage, 'error')
      return
    }

    try {
      const response = await minimaxClient.retrieveDownloadURL({ file_id: fileId })

      if (response.base_resp.status_code !== MINIMAX_BASE_RESP_STATUS_CODES.SUCCESS) return

      setDownloadUrl(response.file.download_url)
    } catch (error) {
      console.error(error)
      showToast(errorMessage, 'error')
    }
  }

  // const saveTaskIdToStorage = (newTaskId: string) => {
  //   const existingTaskIds = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as string[]
  //   const updatedTaskIds = [...existingTaskIds, newTaskId]
  //   localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTaskIds))
  // }

  // ポーリング処理
  const pollStatus = async (taskId: string) => {
    try {
      const response = await minimaxClient.queryTaskImageToVideo({ task_id: taskId })

      const isComplete = response.status === MINIMAX_TASK_STATUS_CODES.SUCCESS

      if (!isComplete) {
        // ５秒後に再度確認
        setTimeout(() => pollStatus(taskId), 5000)
      } else {
        const fileId = response.file_id || ''

        setTaskId(response.task_id)
        setFileId(fileId)

        await handleRetrieveDownloadURL(fileId)
      }
    } catch (error) {
      console.error('Polling error:', error)
      showToast('Failed to generate video', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    handleGenerateVideoFromImage,
    handleQueryTask,
    taskId,
    fileId,
    downloadUrl,
  }
}
