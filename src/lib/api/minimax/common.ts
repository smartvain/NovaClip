const API_BASE_URL = process.env.MINIMAX_API_BASE_URL!
const API_KEY = process.env.MINIMAX_API_KEY!

export function requestToMinimax(endpoint: string, options?: RequestInit) {
  return fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options?.headers,
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
  })
}
