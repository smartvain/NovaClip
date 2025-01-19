'use server'

import { cookies } from 'next/headers'

export async function setCookieAction({
  name,
  value,
  maxAge,
}: {
  name: string
  value: string
  maxAge: number
}) {
  const cookieStore = await cookies()
  cookieStore.set({
    name,
    value,
    maxAge,
    path: '/',
  })
}
