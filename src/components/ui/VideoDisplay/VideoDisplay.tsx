import React from 'react'

import { VideoDisplayProps } from './types'

export const VideoDisplay: React.FC<VideoDisplayProps> = ({ videoUrl, isLoading, onClose }) => {
  return (
    <div
      className={`bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm h-[600px] ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <div className="relative rounded-lg overflow-hidden bg-black h-full">
        {videoUrl && (
          <>
            <button
              onClick={onClose}
              className="absolute top-2 right-2 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <video
              key={videoUrl}
              controls
              autoPlay
              loop
              className="w-full max-w-2xl mx-auto h-full"
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support video playback.
            </video>
          </>
        )}
        {isLoading && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <svg
              className="animate-spin h-10 w-10 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}
      </div>
    </div>
  )
}
