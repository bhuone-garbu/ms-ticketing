import { CustomError } from './custom-error';

export class NotAuthorized extends CustomError {
  statusCode = 401;

  constructor() {
    super('Not authorized');
    Object.setPrototypeOf(this, NotAuthorized.prototype);
  }

  serializeErrors() {
    return [{
      message: 'Not authorized'
    }];
  }
}
