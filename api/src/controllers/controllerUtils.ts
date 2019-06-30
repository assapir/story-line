import { Response } from "express";
import HttpStatus from "http-status-codes";

export function sendResult(res: Response, result: any, statusCode: number = HttpStatus.OK): void {
    res.status(statusCode).json(result);
}
