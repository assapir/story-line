import { Application, NextFunction, Request, Response, Router } from "express";
import { Connection, Repository } from "typeorm";
import BadRequestException from "../exceptions/badRequestException";
import NotFoundException from "../exceptions/notFoundException";
import Line from "../models/line";

export default class LineController {

    public static set repository(repository: Repository<Line>) {
        if (LineController._repository) {
            return;
        }
        LineController._repository = repository;
    }

    public static async getAllLines(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const allLines = await LineController._repository.find();
            if (!allLines || allLines.length === 0) {
                throw new NotFoundException(`No lines found`);
            }

            res.status(200).send(JSON.stringify({lines: allLines}));
        } catch (error) {
            next(error);
        }
    }

    public static async createNewLine(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const text = req.body.text;
            if (!text) {
                throw new BadRequestException(`missing text parameter`);
            }

            const line = new Line();
            line.text = text;
            const result  = await LineController._repository.save(line);

            res.status(200).send(JSON.stringify(result));
        } catch (error) {
            next(error);
        }
    }

    public static async getLine(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id;
            if (!id) {
                throw new BadRequestException(`missing id parameter`);
            }

            const line = await LineController._repository.findOne(id);
            if (!line) {
                throw new NotFoundException(`Unable to find line with id '${id}'`);
            }
            res.status(200).send(JSON.stringify(line));
        } catch (error) {
            next(error);
        }
    }

    public static async deleteLine(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            throw new NotFoundException(`deleteLine Not implmented`);
        } catch (error) {
            next(error);
        }
    }

    private static _repository: Repository<Line>;
}
