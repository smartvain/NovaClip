import { useState } from 'react'

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

export const usePrompt = () => {
  const [prompt, setPrompt] = useState<string>(initialPrompt)
  const [negativePrompt, setNegativePrompt] = useState<string>(initialNegativePrompt)

  const atatchInitialPrompt = (prompt: string) => {
    return `${prompt}, ${initialPrompt}`
  }

  const atatchInitialNegativePrompt = (negativePrompt: string) => {
    return `${negativePrompt}, ${initialNegativePrompt}`
  }

  return {
    prompt,
    negativePrompt,
    setPrompt,
    setNegativePrompt,
    atatchInitialPrompt,
    atatchInitialNegativePrompt,
  }
}
