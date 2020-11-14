import { CustomError } from './custom-error';
export declare class NotAuthorized extends CustomError {
    statusCode: number;
    constructor();
    serializeErrors(): {
        message: string;
    }[];
}
