import { Request, Response, NextFunction } from 'express';
import { RequestValidationError } from '../errors/request-validation-error';
import { DatabaseConnectionError } from '../errors/database-connection-error';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction) => {

  if (error instanceof RequestValidationError) {
    const formattedErrors = error.errors.map(e => ({ message: e.msg, field: e.param}));

    return res.status(400).send({errors: formattedErrors});
  }

  if (error instanceof DatabaseConnectionError) {
    return res.status(500).send({ errors: [{message: error.reason}]})
  }

  res.status(500).send({
    errors: [{ message: 'Something went wrong'}]
  });
};
