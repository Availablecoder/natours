class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // All errors we will make will be operational;
    Error.captureStackTrace(this, this.constructor); // Search for this
  }
}

module.exports = AppError;
