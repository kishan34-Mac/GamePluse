import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { sendSuccess } from '../utils/apiResponse.js';

export function getHealth(_req: Request, res: Response) {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

  sendSuccess(res, {
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
}
