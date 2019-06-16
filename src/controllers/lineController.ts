import { Application, NextFunction, Request, Response, Router } from "express";
import { linePath } from "../consts";
import BadRequestException from "../exceptions/badRequestException";
import LineService from "../services/lineService";

// /${prefix}/${apiVersion}/lines
class LineController {

    private readonly _service: LineService;

    constructor(app: Application, service: LineService) {
        this.initializeRouter(app);
        this._service = service;
    }

    // get(`/`)
    public async getAllLines(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const allLines = await this._service.getAllLines();
            this.sendResult(res, { lines: allLines });
        } catch (error) {
            next(error);
        }
    }

    // post(`/`)
    public async createNewLine(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const text = req.body.text;
            if (!text) {
                throw new BadRequestException(`missing text parameter`);
            }

            const userId = req.body.userId;
            if (!userId) {
                throw new BadRequestException(`missing userId parameter`);
            }

            const storyId = req.body.storyId;
            if (!storyId) {
                throw new BadRequestException(`missing storyId parameter`);
            }

            const result = await this._service.createLine(text, userId, storyId);
            this.sendResult(res, result);
        } catch (error) {
            next(error);
        }
    }

    // get(`/:id`)
    public async getLine(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const line = await this._service.getLine(req.params.id);
            this.sendResult(res, line);
        } catch (error) {
            next(error);
        }
    }

    // delete(`/:id`)
    public async deleteLine(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const line = await this._service.removeLine(req.params.id);
            this.sendResult(res, line);
        } catch (error) {
            next(error);
        }
    }

    // put(`/:id`)
    public async updateLine(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const line = await this._service.updateLine(req.params.id,
                                                        req.body.text,
                                                        req.body.userId,
                                                        req.body.storyId);
            this.sendResult(res, line);
        } catch (error) {
            next(error);
        }
    }

    private initializeRouter(app: Application): void {
        const router = Router();
        app.use(linePath, router);
        router
            .get(`/`,  (req, res, next) => this.getAllLines(req, res, next))
            .get(`/:id`, (req, res, next) => this.getLine(req, res, next))
            .post(`/`, (req, res, next) => this.createNewLine(req, res, next))
            .delete(`/:id`, (req, res, next) => this.deleteLine(req, res, next))
            .put(`/:id`, (req, res, next) => this.updateLine(req, res, next));
    }

    private sendResult(res: Response, result: any) {
        res.status(200).json(result);
    }
}

export default (app: Application, service: LineService) => new LineController(app, service);
