import { Request, Response, NextFunction } from 'express';
import { AuthService, AuthTokenPayload } from '../services/authService.js';
import { AdminModel, AdminRole, IAdmin } from '../models/Admin.js';
import { sendError } from '../utils/apiResponse.js';

declare global {
  namespace Express {
    interface Request {
      admin?: IAdmin;
      adminPayload?: AuthTokenPayload;
    }
  }
}

export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  let token: string | undefined;

  // 1. Check HttpOnly cookie
  if (req.cookies && req.cookies.admin_token) {
    token = req.cookies.admin_token;
  }

  // 2. Fall back to Authorization: Bearer <token>
  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    sendError(res, 'Authentication required', 401, 'UNAUTHORIZED');
    return;
  }

  const payload = AuthService.verifyToken(token);
  if (!payload) {
    sendError(res, 'Invalid or expired session token', 401, 'INVALID_TOKEN');
    return;
  }

  const admin = await AdminModel.findById(payload.adminId);
  if (!admin || !admin.isActive) {
    sendError(res, 'Administrator account not found or deactivated', 401, 'ACCOUNT_INACTIVE');
    return;
  }

  req.admin = admin;
  req.adminPayload = payload;
  next();
}

export function requireRole(...allowedRoles: AdminRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.admin) {
      sendError(res, 'Authentication required', 401, 'UNAUTHORIZED');
      return;
    }

    // super_admin always passes
    if (req.admin.role === 'super_admin' || allowedRoles.includes(req.admin.role)) {
      next();
      return;
    }

    sendError(
      res,
      'Forbidden: Insufficient privileges for this action',
      403,
      'FORBIDDEN'
    );
  };
}
