import { Application, NextFunction, Request, Response, Router } from "express";
import { Connection } from "typeorm";
import NotFoundException from "../exceptions/NotFoundException";

export function lineRoute(connection: Connection) {
    const lineController = new LineController(connection);
    const router = Router();
    return router.get(`/`, lineController.getAllLines)
              .get(`/:id`, lineController.getUser)
              .post(`/`, lineController.createNewUser);
}

class LineController {

    private _dbConnection: Connection;

    constructor(dbConnection: Connection) {
        this._dbConnection = dbConnection;
    }

    public async getAllLines(req: Request, res: Response, next: NextFunction) {
        next(new NotFoundException(404, `getAllLines Not implmented`));
    }

    public async getUser(req: Request, res: Response, next: NextFunction) {
        next(new NotFoundException(404, `getUser Not implmented`));
    }

    public async createNewUser(req: Request, res: Response, next: NextFunction) {
        next(new NotFoundException(404, `createNewUser Not implmented`));
    }
}
