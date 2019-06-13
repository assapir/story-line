import { NextFunction, Request, Response, Router } from "express";
import { Repository } from "typeorm";
import BadRequestException from "../exceptions/badRequestException";
import NotFoundException from "../exceptions/notFoundException";
import Line from "../models/line";

class LineController {

    private readonly _repository: Repository<Line>;

    constructor(repository: Repository<Line>) {
        this._repository = repository;
    }

    public async getAllLines(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const allLines = await this._repository.find();
            if (!allLines || allLines.length === 0) {
                throw new NotFoundException(`No lines found`);
            }

            this.sendResult(res, { lines: allLines });
        } catch (error) {
            next(error);
        }
    }

    public async createNewLine(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const text = req.body.text;
            if (!text) {
                throw new BadRequestException(`missing text parameter`);
            }

            const line = new Line();
            line.text = text;
            const result = await this._repository.save(line);

            this.sendResult(res, result);
        } catch (error) {
            next(error);
        }
    }

    public async getLine(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id;
            if (!id) {
                throw new BadRequestException(`missing id parameter`);
            }

            const line = await this._repository.findOne(id);
            if (!line) {
                throw new NotFoundException(`Unable to find line with id '${id}'`);
            }
            this.sendResult(res, line);
        } catch (error) {
            next(error);
        }
    }

    public async deleteLine(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id;
            if (!id) {
                throw new BadRequestException(`missing id parameter`);
            }

            const line = await this._repository.delete(id);
            if (!line) {
                throw new NotFoundException(`Unable to find line with id '${id}'`);
            }
            this.sendResult(res, line);
        } catch (error) {
            next(error);
        }
    }

    public async updateLine(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id;
            if (!id) {
                throw new BadRequestException(`missing id parameter`);
            }

            const line = await this._repository.findOne(id);
            if (!line) {
                throw new NotFoundException(`Unable to find line with id '${id}'`);
            }

            const newLine = req.body;
            if (!newLine) {
                throw new BadRequestException(`missing request body`);
            }
            await this._repository.merge(line, newLine);
            const result = await this._repository.save(line);

            this.sendResult(res, result);
        } catch (error) {
            next(error);
        }
    }

    private sendResult(res: Response, result: any) {
        res.status(200).send(JSON.stringify(result));
    }
}

export default (repository: Repository<Line>) => new LineController(repository);
