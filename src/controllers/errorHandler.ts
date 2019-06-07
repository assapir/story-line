import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

export class ErrorHandler {
    public static NotFoundError(
        req: Request,
        res: Response,
        next: NextFunction): void {
        res.status(404).send(JSON.stringify({ error: "NotFound" }));
    }

    public static InternalError(
        req: Request,
        res: Response,
        next: NextFunction,
        err: ErrorRequestHandler): void
}
