import winston from 'winston'

const { combine, timestamp, colorize, printf, json } = winston.format

// interface Format {
//     level : string
//     message : string
//     label : string
//     timeStamp : any
// }

const customFormat = printf(({level, message, label, timestamp})=> {
    return `${timestamp} : ${level} : ${message}`
})

const logger = winston.createLogger({
    level : 'info',
    format : combine(
        timestamp({format : 'YYYY-MM-DD HH:mm:ss'}),
        json()
    ),
    transports : [
        new winston.transports.File({filename : 'error.log', level: 'error'}),
        new winston.transports.File({filename : 'combined.log'})
    ],
});

logger.add(new winston.transports.Console({
    format : combine(
        colorize(),
        timestamp({format : 'HH:mm:ss'}),
        customFormat
    )
}))

export default logger