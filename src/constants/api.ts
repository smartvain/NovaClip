export const API_STATUS_CODES = {
  SUCCESS: 0,
  ERROR: 1,
  INVALID_REQUEST: 400,
  UNAUTHORIZED: 401,
} as const

export const MINIMAX_TASK_STATUS_CODES = {
  PREPARING: 'Preparing',
  PROCESSING: 'Processing',
  SUCCESS: 'Success',
  FAIL: 'Fail',
} as const

export const MINIMAX_BASE_RESP_STATUS_CODES = {
  SUCCESS: 0,
  TRIGGER_RATE_LIMIT: 1002,
  ACCOUNT_AUTHENTICATION_FAILED: 1004,
  SENSITIVE_CONTENT: 1027,
} as const

export const KLINGAI_STATUS_CODES = {
  SUCCESS: 0,
} as const
