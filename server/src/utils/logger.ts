/**
 * Structured logger for production use.
 * Outputs JSON logs when NODE_ENV=production (easy to pipe into Datadog, Logtail, etc.)
 * Outputs human-readable logs in development.
 *
 * To integrate Sentry:
 *   npm install @sentry/node
 *   Set SENTRY_DSN in .env
 *   Call Sentry.init({ dsn: process.env.SENTRY_DSN }) in index.ts before routes
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

function log(level: LogLevel, message: string, meta?: Record<string, unknown>): void {
  const isProd = process.env.NODE_ENV === 'production';

  if (level === 'debug' && isProd) return; // suppress debug in production

  if (isProd) {
    // Structured JSON — parseable by log aggregators
    const entry = {
      ts: new Date().toISOString(),
      level,
      msg: message,
      ...(meta && Object.keys(meta).length > 0 ? { meta } : {}),
    };
    const output = JSON.stringify(entry);
    if (level === 'error' || level === 'warn') {
      process.stderr.write(output + '\n');
    } else {
      process.stdout.write(output + '\n');
    }
  } else {
    // Human-readable for development
    const prefix = `[${level.toUpperCase()}] ${new Date().toISOString()}`;
    const msg = meta ? `${prefix} ${message} ${JSON.stringify(meta)}` : `${prefix} ${message}`;
    if (level === 'error') console.error(msg);
    else if (level === 'warn') console.warn(msg);
    else console.log(msg);
  }
}

export const logger = {
  info: (msg: string, meta?: Record<string, unknown>) => log('info', msg, meta),
  warn: (msg: string, meta?: Record<string, unknown>) => log('warn', msg, meta),
  error: (msg: string, meta?: Record<string, unknown>) => log('error', msg, meta),
  debug: (msg: string, meta?: Record<string, unknown>) => log('debug', msg, meta),

  /** Log an HTTP request — call from request middleware */
  request: (method: string, url: string, statusCode?: number, durationMs?: number) => {
    log('info', `${method} ${url}`, { statusCode, durationMs });
  },
};
