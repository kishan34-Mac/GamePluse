import mongoose from 'mongoose';
import { env } from '../src/config/env.js';
import { connectDatabase, disconnectDatabase } from '../src/config/database.js';
import { AuthService } from '../src/services/authService.js';
import { logger } from '../src/utils/logger.js';

async function run() {
  const email = process.argv[2] || 'admin@gamepulse.io';
  const password = process.argv[3] || 'GamePulse2026!Admin';
  const name = process.argv[4] || 'Lead Editor';
  const token = process.argv[5] || env.ADMIN_BOOTSTRAP_TOKEN;

  if (!token) {
    // eslint-disable-next-line no-console
    console.error('Error: ADMIN_BOOTSTRAP_TOKEN is required to bootstrap an administrator.');
    process.exit(1);
  }

  try {
    await connectDatabase();
    const admin = await AuthService.bootstrapFirstAdmin(email, password, name, token);
    logger.info('Admin bootstrap complete', { id: admin.id, email: admin.email, role: admin.role });
    // eslint-disable-next-line no-console
    console.log(`\nAdministrator created successfully!\nEmail: ${admin.email}\nRole: ${admin.role}\n`);
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error('Bootstrap failed:', err.message);
    process.exit(1);
  } finally {
    await disconnectDatabase();
  }
}

run();
