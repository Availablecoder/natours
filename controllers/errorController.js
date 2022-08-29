const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
  const message = `Duplicate fields value: (${err.keyValue.name}). Please use another value!`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((e) => e.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};
const handleJWTError = () =>
  new AppError('Invalid token, please login again!', 401);
const handleJWTExpiredError = () =>
  new AppError('Your token has expired, please login again!', 401);

const sendErrorDev = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    // B) RENDERED WEBSITE
    console.error('ERROR !->', err);
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }
};
const sendErrorProd = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      // Operational. trusted error: send message to client
      res.status(500).json({
        status: err.status,
        message: err.message,
      });

      // Programming or other unknown errors: don't leak error details
    } else {
      // 1) Log error
      console.error('ERROR !->', err);

      // 2) Send generic message
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong!',
      });
    }
  } else {
    // B) RENDERED WEBSITE
    if (err.isOperational) {
      console.log('OPERATIONAL ERROR');
      console.log('MESSSGE ->' + err.message + '<-');
      // Operational. trusted error: send message to client
      res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: err.message,
      });

      // Programming or other unknown errors: don't leak error details
    } else {
      // 1) Log error
      console.error('ERROR !->', err);

      // 2) Send generic message
      res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: 'Please try again later.',
      });
    }
  }
};

// Since you passed 4 params then this is the error execution function that will be called when the next() executes with a parameter (error param)
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    let error = { ...err };
    error.message = err.message;
    console.log(error.message);
    if (err.name === 'CastError') {
      error = handleCastErrorDB(error);
    }
    if (err.code === 11000) {
      error = handleDuplicateFieldsDB(error);
    }
    if (err.name === 'ValidationError') {
      error = handleValidationErrorDB(error);
    }
    if (err.name === 'JsonWebTokenError') {
      error = handleJWTError();
    }
    if (err.name === 'TokenExpiredError') {
      error = handleJWTExpiredError();
    }

    console.log(error);
    sendErrorProd(error, req, res);
  }
};
