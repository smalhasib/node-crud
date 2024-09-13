import {NextFunction, Request, Response} from "express";
import {ErrorCode, HttpException} from "./exceptions/root";
import {InternalException} from "./exceptions/internal-exception";
import {UnprocessableEntity} from "./exceptions/validation";
import {ZodError} from "zod";

export const errorHandler = (method: Function) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await method(req, res, next);
        } catch (error: any) {
            let exception: HttpException;
            if (error instanceof HttpException) {
                exception = error;
            } else if (error instanceof ZodError) {
                exception = new UnprocessableEntity(error.issues, "Validation failed", ErrorCode.UNPROCESSABLE_ENTITY);
            } else {
                exception = new InternalException('Something went wrong!', error, ErrorCode.INTERNAL_EXCEPTION);
            }
            next(exception);
        }
    }
}