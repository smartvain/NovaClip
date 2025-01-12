'use client'

import { useEffect } from 'react'

import { ToastProps } from './types'

export function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  }[type]

  return (
    <div className="fixed top-0 left-0 right-0 flex items-center justify-center pointer-events-none z-50">
      <div
        className={`
          ${bgColor} 
          text-white 
          px-6 
          py-3 
          rounded-lg
          shadow-lg
          mt-4
          animate-fade-in-down
          max-w-sm
          text-center
        `}
      >
        {message}
      </div>
    </div>
  )
}
