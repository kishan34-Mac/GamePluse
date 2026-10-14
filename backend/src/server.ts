import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { logger } from './utils/logger.js';

async function startServer() {
  try {
    // 1. Connect to MongoDB
    await connectDatabase();

    // 2. Initialize Express application
    const app = createApp();

    // 3. Listen on port
    const server = app.listen(env.PORT, () => {
      logger.info(`GAMEPULSE backend server running on port ${env.PORT}`, {
        env: env.NODE_ENV,
        port: env.PORT,
        origin: env.FRONTEND_ORIGIN,
      });
    });

    // Graceful Shutdown
    const handleShutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        logger.info('HTTP server closed');
        await disconnectDatabase();
        process.exit(0);
      });

      // Force shutdown after 10s timeout
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
    process.on('SIGINT', () => handleShutdown('SIGINT'));
  } catch (error: any) {
    logger.error('Fatal error starting server', { error: error.message });
    process.exit(1);
  }
}

startServer();
