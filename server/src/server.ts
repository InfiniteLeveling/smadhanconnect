import { createApp } from './app';
import { env } from './config/env.config';
import { connectDatabase } from './database/prisma.service';
import { Logger } from './common/utils/logger';

const startServer = async () => {
  try {
    // Attempt database connection
    await connectDatabase();

    const app = createApp();

    const server = app.listen(env.PORT, () => {
      Logger.info(`🚀 INVICTUS Backend Server running on port ${env.PORT}`);
      Logger.info(`📡 API Base: http://localhost:${env.PORT}${env.API_PREFIX}`);
      Logger.info(`📖 Swagger Docs: http://localhost:${env.PORT}/api/docs`);
    });

    const shutdown = async () => {
      Logger.info('🛑 Shutting down server gracefully...');
      server.close(() => {
        Logger.info('🔒 HTTP server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    Logger.error('❌ Failed to start INVICTUS Backend Server:', error);
    process.exit(1);
  }
};

startServer();
