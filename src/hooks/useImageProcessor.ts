import { useState } from 'react'

interface ImageValidationRules {
  minDimensions: { width: number; height: number }
  maxFileSize: number
  aspectRatioRange: { min: number; max: number }
}

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

  const processImage = async (file: File): Promise<{ isValid: boolean; error?: string }> => {
    if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
      return { isValid: false, error: 'JPG または PNG 形式の画像のみ対応しています。' }
    }

    const isValid = await validateImage(file)
    if (!isValid) {
      return {
        isValid: false,
        error:
          '画像は300x300px以上、アスペクト比1:2.5〜2.5:1の範囲内、10MB以下である必要があります。',
      }
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

  return {
    imagePreviewUrl,
    imageUrl,
    setImagePreviewUrl,
    setImageUrl,
    processImage,
  }
}
