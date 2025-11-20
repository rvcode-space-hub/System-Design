class ApiError extends Error {
  constructor(status = 400, message = "Error", code = "ERR") {
    super(message);
    this.status = status;
    this.code = code;
  }
}

module.exports = ApiError;
