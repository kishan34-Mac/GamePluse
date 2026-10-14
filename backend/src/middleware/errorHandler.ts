import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';
import { sendError } from '../utils/apiResponse.js';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Redact sensitive headers/body when logging error
  logger.error('Unhandled request error', {
    path: req.path,
    method: req.method,
    errorMessage: err.message,
    statusCode: err.statusCode || 500,
  });

  // Handle Mongoose duplicate key error (E11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    sendError(res, `A record with this ${field} already exists.`, 409, 'DUPLICATE_KEY', { field });
    return;
  }

  // Handle Mongoose CastError (e.g. invalid ObjectId)
  if (err.name === 'CastError') {
    sendError(res, `Invalid format for parameter: ${err.path}`, 400, 'INVALID_ID');
    return;
  }

  // Handle Mongoose ValidationError
  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors || {}).map((e: any) => ({
      field: e.path,
      message: e.message,
    }));
    sendError(res, 'Database validation error', 422, 'VALIDATION_ERROR', details);
    return;
  }

  const statusCode = typeof err.statusCode === 'number' && err.statusCode >= 400 && err.statusCode < 600 ? err.statusCode : 500;
  const isProd = process.env.NODE_ENV === 'production';
  const message = isProd && statusCode === 500 ? 'Internal server error' : err.message || 'Internal server error';

  sendError(res, message, statusCode, err.code || 'INTERNAL_ERROR');
}
