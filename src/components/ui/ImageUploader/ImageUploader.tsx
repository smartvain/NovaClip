import NextImage from 'next/image'

import { ImageUploadProps } from './types'

export function ImageUploader({
  onSelectImage,
  onRemoveImage,
  imagePreviewUrl,
  acceptTypes = 'image/jpeg,image/jpg,image/png',
  className,
}: ImageUploadProps) {
  return (
    <div className={className}>
      <label
        htmlFor="image"
        className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 overflow-hidden"
      >
        {imagePreviewUrl ? (
          <>
            <NextImage
              src={imagePreviewUrl}
              alt="Preview"
              width={500}
              height={400}
              className="w-full h-full object-contain"
            />
            <button
              onClick={(e) => {
                e.preventDefault()
                onRemoveImage()
              }}
              className="absolute top-2 right-2 bg-gray-600 dark:bg-gray-400 text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-700 dark:hover:bg-gray-500"
              aria-label="画像を削除"
            >
              ✕
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">Click / Drop / Paste</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Select from History</p>
          </div>
        )}
        <input
          type="file"
          id="image"
          accept={acceptTypes}
          onChange={onSelectImage}
          className="hidden"
        />
      </label>
    </div>
  )
}
