import { Application, NextFunction, Request, Response } from "express";
import Exception from "../exceptions/exception";
import NotFoundException from "../exceptions/notFoundException";

class ErrorHandlerController {

    constructor(app: Application) {
        this.initializeRouter(app);
    }

    // General 404 handler
    public NotFoundError(req: Request,
                         res: Response,
                         next: NextFunction): void {
        next(new NotFoundException(`Unable to find resource ${req.originalUrl}`));
    }

    // General error handler
    public InternalError(err: Error,
                         req: Request,
                         res: Response,
                         next: NextFunction): void {
        const message = err.message || `InternalServerError`;
        let statusCode = 500;
        if (err instanceof Exception) {
            const exception = err as Exception;
            statusCode = exception.statusCode;
        }
        res.status(statusCode)
        .json({ error: message });
    }

    private initializeRouter(app: Application) {
        app.use(this.NotFoundError.bind(this));
        app.use(this.InternalError.bind(this));
    }
}

export default (app: Application) => new ErrorHandlerController(app);
