export class HttpException extends Error {
    message: string;
    errorCode: ErrorCode;
    statusCode: number;
    error: any;

    constructor(message: string, errorCode: ErrorCode, statusCode: number, error: any) {
        super(message);
        this.message = message;
        this.errorCode = errorCode;
        this.statusCode = statusCode;
        this.error = error;
    }
}

export enum ErrorCode {
    USER_NOT_FOUND = 1001,
    USER_ALREADY_EXISTS = 1002,
    INVALID_PASSWORD = 1003,
    UNAUTHORIZED = 1004,
    ADDRESS_NOT_FOUND = 1005,
    ADDRESS_NOT_BELONG_TO_USER = 1006,
    UNPROCESSABLE_ENTITY = 2001,
    INTERNAL_EXCEPTION = 3001,
    PRODUCT_NOT_FOUND = 5001,
    CART_ITEM_NOT_FOUND = 5002,
    ORDER_NOT_FOUND = 5003,
}
