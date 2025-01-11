import NextImage from 'next/image'

import { ImageUploadProps } from './types'

export function ImageUploader({
  onSelectImage,
  onRemoveImage,
  imagePreviewUrl,
  acceptTypes = 'image/jpeg,image/jpg,image/png',
}: ImageUploadProps) {
  return (
    <div>
      <input
        type="file"
        id="image"
        accept={acceptTypes}
        onChange={onSelectImage}
        className="w-full p-2 mb-4"
      />
      {imagePreviewUrl && (
        <div className="relative">
          <NextImage
            src={imagePreviewUrl}
            alt="Preview"
            width={500}
            height={400}
            className="w-full h-[400px] object-contain mb-4"
          />
          <button
            onClick={onRemoveImage}
            className="absolute top-2 right-2 bg-gray-600 text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-700"
            aria-label="画像を削除"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}
