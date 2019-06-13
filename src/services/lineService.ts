import { Repository } from "typeorm";
import BadRequestException from "../exceptions/badRequestException";
import NotFoundException from "../exceptions/NotFoundException";
import Line from "../models/line";
import Story from "../models/story";
import User from "../models/user";

export default class LineService {
    private readonly _repository: Repository<Line>;
    constructor(repository: Repository<Line>) {
        this._repository = repository;
    }

    public async getLine(id: string): Promise<Line> {
        if (!id) {
            throw new BadRequestException(`missing id parameter`);
        }

        const line = await this._repository.findOne(id);
        if (!line) {
            throw new NotFoundException(`Unable to find line with id '${id}'`);
        }

        return line;
    }

    public async getAllLines(): Promise<Line[]> {
        const allLines = await this._repository.find();
        if (!allLines || allLines.length === 0) {
            throw new NotFoundException(`No lines found`);
        }

        return allLines;
    }

    public async createLine(text: string, userId: string, storyId: string): Promise<Line> {
        if (!text) {
            throw new BadRequestException(`missing text parameter`);
        }

        if (!userId) {
            throw new BadRequestException(`missing user parameter`);
        }

        if (!storyId) {
            throw new BadRequestException(`missing story parameter`);
        }

        const line = new Line();
        line.text = text;
        line.userId = userId;
        line.storyId = storyId;
        const result = await this._repository.save(line);
        return result;
    }

    public async deleteLine(id: string): Promise<Line> {
        if (!id) {
            throw new BadRequestException(`missing id parameter`);
        }

        const result = await this._repository.delete(id);
        if (!result.raw) {
            throw new NotFoundException(`Unable to find line with id '${id}'`);
        }

        return result.raw as Line;
    }

    public async updateLine(id: string, text: string, userId: string, storyId: string): Promise<Line> {
        if (!id) {
            throw new BadRequestException(`missing id parameter`);
        }

        const toUpdate = {};
        if (text) {
            toUpdate[`text`] = text;
        }

        if (userId) {
            toUpdate[`userId`] = userId;
        }

        if (storyId) {
            toUpdate[`storyId`] = storyId;
        }

        if (Object.keys(toUpdate).length === 0) {
            throw new BadRequestException(`missing parameters to update`);
        }
        const result = await this._repository.update(id, toUpdate);
        if (!result.raw) {
            throw new NotFoundException(`Unable to find line with id '${id}'`);
        }

        return result.raw as Line;
    }
}