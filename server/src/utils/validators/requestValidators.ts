/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import AppError from '../exception';

export const validateRequestBody =
  (schema: any) =>
  async (request: Request, _: Response, next: NextFunction) => {
    try {
      const validatedData = await schema.parseAsync(request.body);
      (request as any).validatedData = validatedData;
      next();
    } catch (validationError: any) {
      try {
        const parsedError = JSON.parse(validationError);
        next(
          new AppError(
            'VALIDATION_ERROR',
            parsedError.length ? parsedError[0].message : 'Validation Error',
            httpStatus.BAD_REQUEST
          )
        );
      } catch (error) {
        next(validationError);
      }
    }
  };
