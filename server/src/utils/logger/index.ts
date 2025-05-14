import winston from "winston";
import DailyRotateFile, {
  DailyRotateFileTransportOptions,
} from "winston-daily-rotate-file";

const createDailyRotateTransport = (
  folder: string,
  type: string
): DailyRotateFile => {
  const options: DailyRotateFileTransportOptions = {
    dirname: `logs/${folder}`,
    filename: `./logs/${folder}/%DATE%-${type}`,
    datePattern: "YYYY-MM-DD",
    // zippedArchive: true,
    maxSize: "100m",
    maxFiles: "7d",
    extension: ".log",
    utc: true,
    level: type,
  };

  const rotator = new DailyRotateFile(options);

  return rotator;
};
const createLogger = (folder: string) => {
  return winston.createLogger({
    levels: {
      emergency: 0,
      alert: 1,
      critical: 2,
      error: 3,
      warning: 4,
      notice: 5,
      info: 6,
      debug: 7,
    },
    format: winston.format.combine(
      winston.format.timestamp({
        format: "dddd, MMMM Do, YYYY [at] HH:mm:ss A [|] [Timezone] Z",
      }),
      // winston.format.json(),
      winston.format.prettyPrint()
    ),
    transports: [
      new winston.transports.Console(),
      // new winston.transports.File({
      //   filename: `logs/${folder}/info.log`,
      //   level: 'info',
      // }),
      // new winston.transports.File({
      //   filename: `logs/${folder}/emergency.log`,
      //   level: 'emergency',
      // }),
      // new winston.transports.File({
      //   filename: `logs/${folder}/alert.log`,
      //   level: 'alert',
      // }),
      // new winston.transports.File({
      //   filename: `logs/${folder}/critical.log`,
      //   level: 'critical',
      // }),
      // new winston.transports.File({
      //   filename: `logs/${folder}/error.log`,
      //   level: 'error',
      // }),
      createDailyRotateTransport(folder, "info"),
      createDailyRotateTransport(folder, "error"),
    ],
  });
};

export const generalLogger = createLogger("general");
