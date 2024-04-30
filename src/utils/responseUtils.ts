export const sendServiceResponse = (
  statusCode: number,
  error: boolean,
  message: string,
  data: any
): {
  statusCode: number
  response: {
    error: boolean
    message: string
    data: any
  }
} => {
  return {
    statusCode,
    response: {
      error,
      message,
      data,
    },
  }
}
