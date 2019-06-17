import { Application, NextFunction, Request, Response, Router } from "express";
import HttpStatus from "http-status-codes";
import { linesPath } from "../consts";
import BadRequestException from "../exceptions/badRequestException";
import LineService from "../services/lineService";
import { sendResult } from "./controllerUtils";

/**
 * Controller for /${prefix}/${apiVersion}/lines
 *
 * @class LineController
 */
class LineController {

    private readonly _service: LineService;

    /**
     * Creates an instance of LineController.
     * @param {Application} app
     * @param {LineService} service
     * @memberof LineController
     */
    constructor(app: Application, service: LineService) {
        this.initializeRouter(app);
        this._service = service;
    }

    /**
     * Route for GET /
     */
    public async getAllLines(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const allLines = await this._service.getAllLines();
            sendResult(res, { lines: allLines });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Route for POST /
     */
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
            sendResult(res, result, HttpStatus.CREATED);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Route for GET /:id
     */
    public async getLine(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const line = await this._service.getLine(req.params.id);
            sendResult(res, line);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Route for DELETE /:id
     */
    public async deleteLine(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const line = await this._service.removeLine(req.params.id);
            sendResult(res, line);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Route for PUT /:id
     */
    public async updateLine(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const line = await this._service.updateLine(req.params.id,
                                                        req.body.text,
                                                        req.body.userId,
                                                        req.body.storyId);
            sendResult(res, line);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Route for GET /:id/author
     */
    public async getAuthor(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const line = await this._service.getLine(req.params.id, true);
            sendResult(res, line.user);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Route for GET /:id/story
     */
    public async getStory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const line = await this._service.getLine(req.params.id, true);
            sendResult(res, line.story);
        } catch (error) {
            next(error);
        }
    }

    private initializeRouter(app: Application): void {
        const router = Router();
        app.use(linesPath, router);
        router
            .get(`/`,  (req, res, next) => this.getAllLines(req, res, next))
            .get(`/:id`, (req, res, next) => this.getLine(req, res, next))
            .get(`/:id/author`, (req, res, next) => this.getAuthor(req, res, next))
            .get(`/:id/story`, (req, res, next) => this.getStory(req, res, next))
            .post(`/`, (req, res, next) => this.createNewLine(req, res, next))
            .delete(`/:id`, (req, res, next) => this.deleteLine(req, res, next))
            .put(`/:id`, (req, res, next) => this.updateLine(req, res, next));
    }
}

export default (app: Application, service: LineService) => new LineController(app, service);
