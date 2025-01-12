import { VideoSidebarProps } from './types'
export function VideoSidebar({
  isOpen,
  isLoading,
  videoList,
  onToggle,
  onRefresh,
  onSelectVideo,
}: VideoSidebarProps) {
  return (
    <div className="flex">
      <button
        onClick={onToggle}
        className="h-8 w-4 bg-gray-100 hover:bg-gray-200 flex items-center justify-center self-center rounded-l"
      >
        <span className="transform rotate-90 text-gray-500 text-sm">{isOpen ? '▼' : '▲'}</span>
      </button>

      <div
        className={`
          transition-all duration-300 ease-in-out
          ${isOpen ? 'w-[200px]' : 'w-0'}
          flex-shrink-0 border-l overflow-hidden h-full
        `}
      >
        <div className="p-4 w-[200px] h-full overflow-y-auto">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className={`w-full mb-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 flex items-center justify-center gap-2 ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`${isLoading ? 'animate-spin' : ''}`}
            >
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 16h5v5" />
            </svg>
          </button>
          {videoList.map((videoUrl, index) => (
            <div key={index} className="mb-4">
              <video
                className={`w-full h-auto rounded-lg ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                preload="metadata"
                muted
                playsInline
                onClick={() => !isLoading && onSelectVideo(videoUrl)}
                onMouseOver={(e) => !isLoading && e.currentTarget.play()}
                onMouseOut={(e) => {
                  if (!isLoading) {
                    e.currentTarget.pause()
                    e.currentTarget.currentTime = 0
                  }
                }}
              >
                <source src={videoUrl} type="video/mp4" />
              </video>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
