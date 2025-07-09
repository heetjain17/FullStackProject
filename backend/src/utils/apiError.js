class ApiError extends Error {
  constructor(statusCode, message = 'Something went wrong', errors = []) {
    super(message);
    this.success = false;
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
  }
}

class ApiSuccess {
  constructor(statusCode, message, data) {
    (this.success = true),
      (this.statusCode = statusCode),
      (this.message = message),
      (this.data = data);
  }
}
export { ApiError, ApiSuccess };
