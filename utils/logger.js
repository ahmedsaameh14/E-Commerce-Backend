const winston = require('winston');
const fs = require('fs');
const path = require('path');

const transports = [];

if (process.env.NODE_ENV === 'production') {
  transports.push(
    new winston.transports.Console()
  );
} else {
  const logDirectory = path.join(__dirname, '../logs');

  if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
  }

  transports.push(
    new winston.transports.File({
      filename: path.join(logDirectory, 'error.log'),
      level: 'error'
    }),

    new winston.transports.File({
      filename: path.join(logDirectory, 'combined.log')
    }),

    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  );
}

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production'
    ? 'info'
    : 'debug',

  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),

  transports
});

logger.stream = {
  write: message => logger.info(message.trim())
};

module.exports = logger;