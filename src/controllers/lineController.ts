import { NextFunction, Request, Response } from "express";
import BadRequestException from "../exceptions/badRequestException";
import LineService from "../services/lineService";

// `/lines`
class LineController {

    private readonly _service: LineService;

    constructor(service: LineService) {
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
            const line = await this._service.deleteLine(req.params.id);
            this.sendResult(res, line);
        } catch (error) {
            next(error);
        }
    }

    // put(`/:id`)
    public async updateLine(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const line = await this._service.updateLine(req.params.id,
                                                        req.params.text,
                                                        req.params.userId,
                                                        req.params.storyId);
            this.sendResult(res, line);
        } catch (error) {
            next(error);
        }
    }

    private sendResult(res: Response, result: any) {
        res.status(200).send(JSON.stringify(result));
    }
}

export default (service: LineService) => new LineController(service);
