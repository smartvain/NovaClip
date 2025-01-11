'use client'

import { ThemeProvider } from 'next-themes'
import { useEffect, useState } from 'react'

type ProviderProps = {
  children: React.ReactNode
}

export function Provider({ children }: ProviderProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem={true}
      disableTransitionOnChange
      forcedTheme={undefined} // システムのカラーモードを強制的に上書きしない
      themes={['light', 'dark', 'system']} // 利用可能なテーマを明示的に指定
    >
      {children}
    </ThemeProvider>
  )
}
