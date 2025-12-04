import { createLogger, transports, format } from 'winston';
import {Logtail} from "@logtail/node";
import { LogtailTransport } from '@logtail/winston';
import "dotenv/config";

const logtail = new Logtail(process.env.LOGTAIL_API_KEY, {
  endpoint: process.env.LOGTAIL_SOURCE_ENDPOINT 
});

const logger = createLogger({
  level: 'info', // Set the default log level
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Add timestamp to logs
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`) // Define log message format
  ),
  transports: [
    new transports.Console(), // Log to console
    new LogtailTransport(logtail)
  ]
});

export default logger;