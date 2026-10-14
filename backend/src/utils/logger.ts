type LogLevel = 'info' | 'warn' | 'error' | 'debug';

function sanitize(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sanitize);

  const sensitiveKeys = ['password', 'token', 'jwt', 'secret', 'authorization', 'cookie', 'accessToken', 'refreshToken'];
  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (sensitiveKeys.some(s => key.toLowerCase().includes(s))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitize(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

function log(level: LogLevel, message: string, meta?: any) {
  const timestamp = new Date().toISOString();
  const entry: Record<string, any> = {
    timestamp,
    level: level.toUpperCase(),
    message,
  };

  if (meta !== undefined) {
    entry.meta = sanitize(meta);
  }

  const jsonStr = JSON.stringify(entry);

  if (level === 'error') {
    // eslint-disable-next-line no-console
    console.error(jsonStr);
  } else if (level === 'warn') {
    // eslint-disable-next-line no-console
    console.warn(jsonStr);
  } else {
    // eslint-disable-next-line no-console
    console.log(jsonStr);
  }
}

export const logger = {
  info: (msg: string, meta?: any) => log('info', msg, meta),
  warn: (msg: string, meta?: any) => log('warn', msg, meta),
  error: (msg: string, meta?: any) => log('error', msg, meta),
  debug: (msg: string, meta?: any) => {
    if (process.env.NODE_ENV !== 'production') {
      log('debug', msg, meta);
    }
  },
};
