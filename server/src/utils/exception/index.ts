import httpStatus from "http-status";
import * as util from "util";

import { generalLogger } from "../logger";

class AppError extends Error {
  constructor(
    public type: string,
    public override message: string,
    public HTTPStatus: number = 500
  ) {
    super(message);
  }
}

const normalizeError = (errorToHandle: unknown): AppError => {
  if (errorToHandle instanceof AppError) {
    return errorToHandle;
  }
  if (errorToHandle instanceof Error) {
    const appError = new AppError(
      errorToHandle.name,
      errorToHandle.message,
      httpStatus.INTERNAL_SERVER_ERROR
    );
    if (errorToHandle.stack) {
      appError.stack = errorToHandle.stack;
    }
    return appError;
  }

  const inputType = typeof errorToHandle;
  return new AppError(
    "GENERAL_ERROR",
    `Error Handler received a none error instance with type - ${inputType}, value - ${util.inspect(
      errorToHandle
    )}`,
    httpStatus.INTERNAL_SERVER_ERROR
  );
};

export const HandleError = (errorToHandle: unknown): AppError => {
  const appError: AppError = normalizeError(errorToHandle);
  generalLogger.error(appError.message);
  return appError;
};

export default AppError;
