import { Request, Response, NextFunction } from 'express';
import { RequestValidationError } from '../errors/request-validation-error';
import { DatabaseConnectionError } from '../errors/database-connection-error';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction) => {

  if (error instanceof RequestValidationError) {
    console.log('handling this error as RequestValidationError')
  }

  if (error instanceof DatabaseConnectionError) {
    console.log('handling this error as db connection error')
  }

  res.status(400).send({
    message: error
  });
};
