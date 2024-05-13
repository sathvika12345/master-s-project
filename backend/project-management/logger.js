const winston = require('winston');
const moment = require('moment');


const myDate=moment(new Date().toISOString()).format('MMM-DD-YYYY');

const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json()
  ),
    transports: [
      new winston.transports.File({
        filename: `public/logs/${myDate}.log`,
        level: "info"
      }),
      new winston.transports.File({
        filename: `public/err_logs/${myDate}.log`,
        level: "error"
      })
    ]
  });
 console.log("inside logger");

  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));


module.exports = logger;
