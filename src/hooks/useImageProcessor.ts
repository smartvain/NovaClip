import { useState } from 'react'

interface ImageValidationRules {
  minDimensions: { width: number; height: number }
  maxFileSize: number
  aspectRatioRange: { min: number; max: number }
}

type ProcessImageResult = { isValid: boolean; error?: string }

const ERROR_MESSAGES = {
  INVALID_FORMAT: 'JPG または PNG 形式の画像のみ対応しています。',
  INVALID_CONSTRAINTS:
    '画像は300x300px以上、アスペクト比1:2.5〜2.5:1の範囲内、10MB以下である必要があります。',
} as const

export const useImageProcessor = (
  validationRules: ImageValidationRules = {
    minDimensions: { width: 300, height: 300 },
    maxFileSize: 10 * 1024 * 1024, // 10MB
    aspectRatioRange: { min: 1 / 2.5, max: 2.5 },
  }
) => {
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  // 画像のバリデーション
  const validateImage = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const isValidResolution =
          img.width >= validationRules.minDimensions.width &&
          img.height >= validationRules.minDimensions.height
        const aspectRatio = img.width / img.height
        const isValidAspectRatio =
          aspectRatio >= validationRules.aspectRatioRange.min &&
          aspectRatio <= validationRules.aspectRatioRange.max
        const isValidSize = file.size <= validationRules.maxFileSize

        resolve(isValidResolution && isValidAspectRatio && isValidSize)
      }
      img.src = URL.createObjectURL(file)
    })
  }

  // Base64文字列からプレフィックスを削除する関数
  const removeBase64Prefix = (base64String: string): string => {
    const base64Prefix = /^data:image\/[a-z]+;base64,/
    return base64String.replace(base64Prefix, '')
  }

  const isValidImageFormat = (file: File): boolean => {
    return Boolean(file.type.match(/^image\/(jpeg|jpg|png)$/))
  }

  const validateImageWithFormat = async (file: File): Promise<ProcessImageResult> => {
    if (!isValidImageFormat(file)) {
      return { isValid: false, error: ERROR_MESSAGES.INVALID_FORMAT }
    }

    const isValid = await validateImage(file)
    if (!isValid) {
      return { isValid: false, error: ERROR_MESSAGES.INVALID_CONSTRAINTS }
    }

    return { isValid: true }
  }

  const processImageForKling = async (file: File): Promise<ProcessImageResult> => {
    const validationResult = await validateImageWithFormat(file)
    if (!validationResult.isValid) {
      return validationResult
    }

    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImagePreviewUrl(reader.result)
          setImageUrl(removeBase64Prefix(reader.result))
          resolve({ isValid: true })
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const processImageForMinimax = async (file: File): Promise<ProcessImageResult> => {
    const validationResult = await validateImageWithFormat(file)
    if (!validationResult.isValid) {
      return validationResult
    }

    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImagePreviewUrl(reader.result)
          setImageUrl(reader.result)
          resolve({ isValid: true })
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleRemovePreviewImage = () => {
    setImageUrl(null)
    setImagePreviewUrl(null)
    const input = document.getElementById('image') as HTMLInputElement
    if (input) input.value = ''
  }

  return {
    imagePreviewUrl,
    imageUrl,
    setImagePreviewUrl,
    setImageUrl,
    processImageForKling,
    processImageForMinimax,
    handleRemovePreviewImage,
  }
}
