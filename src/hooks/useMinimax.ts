import { useState } from 'react'

import { CreateTaskImageToVideoRequest, minimaxClient } from '@/api/minimax'
import { useToast } from '@/components/ui'

const TASK_ID_HOGE = '227075836317832'

const STORAGE_KEY = 'minimax_task_ids'

export const useMinimax = (setIsLoading: (isLoading: boolean) => void) => {
  const [taskId, setTaskId] = useState<string>('')
  const [fileId, setFileId] = useState<string>('')

  const { showToast } = useToast()

  // minimaxのモデルを使用して動画を生成
  const handleMinimaxGenerateVideoFromImage = async (params: CreateTaskImageToVideoRequest) => {
    try {
      setIsLoading(true)

      const response = await minimaxClient.createTaskImageToVideo(params)

      if (response.base_resp.status_code === 0) {
        setTaskId(response.task_id)
        saveTaskIdToStorage(response.task_id)
      }

      // pollStatus(response.task_id)
    } catch (error) {
      console.error(error)
      showToast('Failed to generate video', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleQueryTaskForMinimax = async () => {
    try {
      setIsLoading(true)

      const result = await minimaxClient.queryTaskImageToVideo({ task_id: TASK_ID_HOGE })
      console.log('handleQueryTaskForMinimax result:', result)

      if (result.status === 'Success') {
        setTaskId(result.task_id)
        setFileId(result.file_id || '')
      }

      showToast('Task list updated successfully', 'info')
    } catch (error) {
      console.error(error)
      showToast('Failed to fetch task list', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const saveTaskIdToStorage = (newTaskId: string) => {
    const existingTaskIds = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as string[]
    const updatedTaskIds = [...existingTaskIds, newTaskId]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTaskIds))
  }

  return {
    handleMinimaxGenerateVideoFromImage,
    handleQueryTaskForMinimax,
    taskId,
    fileId,
  }
}
