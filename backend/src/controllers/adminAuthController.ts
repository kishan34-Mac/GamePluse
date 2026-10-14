import { Request, Response } from 'express';
import { AuthService } from '../services/authService.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  try {
    const { admin, token } = await AuthService.authenticateAdmin(email, password);

    // Set secure HttpOnly cookie
    const isProd = env.NODE_ENV === 'production';
    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    logger.info('Admin logged in successfully', { adminId: admin.id, email: admin.email, role: admin.role });

    sendSuccess(res, {
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        lastLoginAt: admin.lastLoginAt,
      },
      token,
    });
  } catch (error: any) {
    if (error.message === 'ACCOUNT_LOCKED') {
      sendError(res, 'Account temporarily locked due to multiple failed attempts. Please try again later.', 429, 'ACCOUNT_LOCKED');
      return;
    }
    if (error.message === 'ACCOUNT_DISABLED') {
      sendError(res, 'Account deactivated. Please contact an administrator.', 403, 'ACCOUNT_DISABLED');
      return;
    }
    // Generic message to avoid account enumeration
    sendError(res, 'Invalid email or password.', 401, 'INVALID_CREDENTIALS');
  }
}

export function logout(_req: Request, res: Response) {
  res.clearCookie('admin_token', {
    httpOnly: true,
    path: '/',
  });
  sendSuccess(res, { message: 'Logged out successfully' });
}

export function getMe(req: Request, res: Response) {
  if (!req.admin) {
    sendError(res, 'Unauthorized', 401, 'UNAUTHORIZED');
    return;
  }

  sendSuccess(res, {
    id: req.admin.id,
    email: req.admin.email,
    name: req.admin.name,
    role: req.admin.role,
    lastLoginAt: req.admin.lastLoginAt,
  });
}

export async function bootstrap(req: Request, res: Response) {
  const { email, password, name, bootstrapToken } = req.body;

  try {
    const admin = await AuthService.bootstrapFirstAdmin(email, password, name, bootstrapToken);
    sendSuccess(res, {
      message: 'Initial administrator successfully created.',
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    }, 201);
  } catch (error: any) {
    if (error.message === 'INVALID_BOOTSTRAP_TOKEN') {
      sendError(res, 'Invalid bootstrap authorization token', 403, 'FORBIDDEN');
      return;
    }
    if (error.message === 'ADMIN_ALREADY_EXISTS') {
      sendError(res, 'Bootstrap disabled: An administrator already exists in the system.', 409, 'ALREADY_EXISTS');
      return;
    }
    sendError(res, error.message || 'Bootstrap failed', 400, 'BAD_REQUEST');
  }
}
