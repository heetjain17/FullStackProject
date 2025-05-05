class ApiError extends Error {
    constructor(
      statusCode,
      message = "Something went wrong",
      errors = [],
    ) {
      super(message);
      this.statusCode = statusCode;
      this.message = message;
      this.success = false;
      this.errors = errors;

    }
  }
  
class ApiSuccess {
    constructor(
      statusCode,
      message,
      data
    ){
      this.statusCode = statusCode,
      this.message = message,
      this.data = data,
      this.success = true
    }
}
export { ApiError, ApiSuccess};