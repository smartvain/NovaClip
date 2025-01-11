import { useState } from 'react'

interface VideoConverterState {
  isLoading: boolean
  error: string | null
  videoUrl: string | null
  prompt: string
  negative_prompt: string
}

interface VideoConverterActions {
  setIsLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setVideoUrl: (url: string | null) => void
  setPrompt: (prompt: string) => void
  setNegativePrompt: (prompt: string) => void
}

export function useVideoConverter(): [VideoConverterState, VideoConverterActions] {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [prompt, setPrompt] = useState<string>('')
  const [negative_prompt, setNegativePrompt] = useState<string>('')

  return [
    {
      isLoading,
      error,
      videoUrl,
      prompt,
      negative_prompt,
    },
    {
      setIsLoading,
      setError,
      setVideoUrl,
      setPrompt,
      setNegativePrompt,
    }
  ]
}
