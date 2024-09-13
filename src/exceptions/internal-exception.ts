import {ErrorCode, HttpException} from "./root";

export class InternalException extends HttpException {
    constructor(message: string, error: any, errorCode: ErrorCode) {
        super(message, errorCode, 500, error);
    }
}