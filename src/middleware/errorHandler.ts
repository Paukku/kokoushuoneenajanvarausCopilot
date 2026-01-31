import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ApiError } from '../services/errors';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      code: err.code,
      message: err.message,
      timestamp: err.timestamp
    });
  }

  return res.status(500).json({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Sisäinen palvelinvirhe',
    timestamp: new Date().toISOString()
  });
};

export const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
