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
  const [prompt, setPrompt] = useState<string>(
    'dancing, Create a natural, fluid animation with subtle human-like movements:' +
    '- Maintain gentle, organic motion' +
    '- Add slight breathing movement' +
    '- Include minimal head tilt and micro-expressions' +
    '- Ensure smooth transitions between frames' +
    '- Keep movements delicate and realistic' +
    '- Preserve the original image quality' +
    '- Apply natural motion physics'
  )
  const [negative_prompt, setNegativePrompt] = useState<string>(
    'nsfw, lowres, (worst quality, bad quality:1.2), bad anatomy, sketch, ' +
    'jpeg artifacts, signature, watermark, old, oldest, censored, bar_censor, ' +
    '(pregnant), chibi, loli, simple background'
  )

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
