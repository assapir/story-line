import { Application, NextFunction, Request, Response, Router } from "express";
import { storiesPath } from "../consts";
import StoryService from "../services/storyService";
import { sendResult } from "./controllerUtils";

/**
 * Controller for /${prefix}/${apiVersion}/stories
 *
 * @class StoryController
 */
class StoryController {
    public s;

    private readonly _service: StoryService;

    /**
     * Creates an instance of StoryController.
     * @param {Application} app
     * @param {StoryService} storyService
     * @memberof StoryController
     */
    constructor(app: Application, storyService: StoryService) {
        this.initializeRouter(app);
        this._service = storyService;
    }

    /**
     * Route for GET /
     */
    public async getAllStories(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const allStories = await this._service.getAllStories();
            sendResult(res, { stories: allStories });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Route for GET /:id
     */
    public async getStory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const story = await this._service.getStory(req.params.id);
            sendResult(res, story);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Route for POST /
     */
    public async createNewStory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const story = await this._service.createStory(req.body.name);
            sendResult(res, story);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Route for PUT /:id
     */
    public async changeStoryName(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const story = await this._service.updateStoryName(req.params.id, req.body.name);
            sendResult(res, story);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Route for DELETE /:id
     */
    public async deleteStory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const story = await this._service.deleteStory(req.params.id);
            sendResult(res, story);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Route for DELETE /:id/lines
     */
    public async resetStory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const story = await this._service.resetStory(req.params.id);
            sendResult(res, story);
        } catch (error) {
            next(error);
        }
    }

    private initializeRouter(app: Application): void {
        const router = Router();
        router
            .get(`/`, this.getAllStories.bind(this))
            .get(`/:id`, this.getStory.bind(this))
            .post(`/`, this.createNewStory.bind(this))
            .delete(`/:id`, this.deleteStory.bind(this))
            .delete(`/:id/lines`, this.resetStory.bind(this))
            .put(`/:id`, this.changeStoryName.bind(this));
        app.use(storiesPath, router);
    }
}

export default (app: Application, service: StoryService) => new StoryController(app, service);
