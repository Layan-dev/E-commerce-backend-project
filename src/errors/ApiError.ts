class ApiError {
  constructor(public code: number, public message: string) {
    this.code = code
    this.message = message
  }
  static badRequest(msg: string) {
    return new ApiError(400, msg)
  }
  static internal(msg: string) {
    return new ApiError(500, msg)
  }
  static conflict(message: string) {
    return new ApiError(409, message)
  }
  static unauthorized(message: string) {
    return new ApiError(401, message)
  }
  static notFound(message: string) {
    return new ApiError(404, message)
  }
  static forbidden(message: string) {
    return new ApiError(403, message)
  }
}

export default ApiError
