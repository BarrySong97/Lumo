export const commonErrors = {
  UNAUTHORIZED: {
    message: "Unauthorized",
  },

  FORBIDDEN: {
    message: "Forbidden",
  },

  NOT_FOUND: {
    message: "Not Found",
  },

  BAD_REQUEST: {
    message: "Bad Request",
  },

  INTERNAL_ERROR: {
    message: "Internal Server Error",
  },
} as const

export type CommonErrorMap = typeof commonErrors
