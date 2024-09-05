import {HttpException} from "../exceptions/root";
import {NextFunction, Request, Response} from "express";

export const errorMiddleware = (error: HttpException, _req: Request, res: Response, _next: NextFunction) => {
    res.status(error.statusCode).json({
        message: error.message,
        errorCode: error.errorCode,
        error: error.error
    })
}