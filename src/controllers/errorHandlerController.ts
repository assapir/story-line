import { NextFunction, Request, Response } from "express";
import { DevlopementEnviorment } from "../consts";

const env = process.env.NODE_ENV || DevlopementEnviorment;

export class ErrorHandlerController {
    public static InternalError(
        err: Error,
        req: Request,
        res: Response,
        next: NextFunction): void {
        const message = err.message || `InternalServerError`;
        if (env === DevlopementEnviorment) {
            console.log(`That esclate quickly! ${message}`);
        }
        res.status(500).send(JSON.stringify({ error:  message}));
    }
}
