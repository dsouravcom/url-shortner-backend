import { createLogger, transports, format } from 'winston';

const logger = createLogger({
  level: 'info', // Set the default log level
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Add timestamp to logs
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`) // Define log message format
  ),
  transports: [
    new transports.Console(), // Log to console
  ]
});

export default logger;