import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AdminModel, IAdmin, AdminRole } from '../models/Admin.js';
import { logger } from '../utils/logger.js';

const SALT_ROUNDS = 12;
const MAX_FAILED_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000; // 15 minutes

export interface AuthTokenPayload {
  adminId: string;
  email: string;
  role: AdminRole;
  name: string;
}

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static generateToken(payload: AuthTokenPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as any,
    });
  }

  static verifyToken(token: string): AuthTokenPayload | null {
    try {
      return jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;
    } catch {
      return null;
    }
  }

  static async authenticateAdmin(email: string, password: string): Promise<{ admin: IAdmin; token: string }> {
    const normalizedEmail = email.toLowerCase().trim();
    const admin = await AdminModel.findOne({ email: normalizedEmail }).select('+passwordHash');

    if (!admin) {
      throw new Error('INVALID_CREDENTIALS');
    }

    if (!admin.isActive) {
      throw new Error('ACCOUNT_DISABLED');
    }

    // Check account lockout
    if (admin.lockUntil && admin.lockUntil.getTime() > Date.now()) {
      throw new Error('ACCOUNT_LOCKED');
    }

    const isMatch = await this.comparePassword(password, admin.passwordHash);

    if (!isMatch) {
      admin.failedLoginAttempts = (admin.failedLoginAttempts || 0) + 1;
      if (admin.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
        admin.lockUntil = new Date(Date.now() + LOCK_TIME_MS);
        logger.warn('Admin account temporarily locked due to failed attempts', { email: normalizedEmail });
      }
      await admin.save();
      throw new Error('INVALID_CREDENTIALS');
    }

    // Reset failed attempts & update lastLoginAt
    admin.failedLoginAttempts = 0;
    admin.lockUntil = undefined;
    admin.lastLoginAt = new Date();
    await admin.save();

    const token = this.generateToken({
      adminId: admin.id,
      email: admin.email,
      role: admin.role,
      name: admin.name,
    });

    return { admin, token };
  }

  static async bootstrapFirstAdmin(
    email: string,
    password: string,
    name: string,
    bootstrapToken: string
  ): Promise<IAdmin> {
    // Validate bootstrap token
    if (!env.ADMIN_BOOTSTRAP_TOKEN || bootstrapToken !== env.ADMIN_BOOTSTRAP_TOKEN) {
      throw new Error('INVALID_BOOTSTRAP_TOKEN');
    }

    // Check if any admin exists
    const count = await AdminModel.countDocuments();
    if (count > 0) {
      throw new Error('ADMIN_ALREADY_EXISTS');
    }

    const passwordHash = await this.hashPassword(password);
    const admin = await AdminModel.create({
      email: email.toLowerCase().trim(),
      passwordHash,
      name,
      role: 'super_admin',
      isActive: true,
    });

    logger.info('First admin bootstrapped successfully', { email: admin.email, role: admin.role });
    return admin;
  }
}
