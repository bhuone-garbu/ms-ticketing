export declare abstract class CustomError extends Error {
    constructor(message: string);
    abstract statusCode: number;
    abstract serializeErrors(): {
        message: string;
        field?: string;
    }[];
}
