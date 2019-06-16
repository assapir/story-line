import { QueryFailedError, Repository } from "typeorm";
import BadRequestException from "../exceptions/badRequestException";
import NotFoundException from "../exceptions/notFoundException";
import Line from "../models/line";

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
        try {
            if (!text) {
                throw new BadRequestException(`missing text parameter`);
            }

            if (!userId) {
                throw new BadRequestException(`missing userId parameter`);
            }

            if (!storyId) {
                throw new BadRequestException(`missing storyId parameter`);
            }

            const line = new Line();
            line.text = text;
            line.userId = userId;
            line.storyId = storyId;
            const result = await this._repository.save(line);
            return result;
        } catch (error) {
            if (error instanceof QueryFailedError) {
                throw new BadRequestException(`some parameters are incorrect`);
            }
            throw error;
        }
    }

    public async removeLine(id: string): Promise<Line> {
        if (!id) {
            throw new BadRequestException(`missing id parameter`);
        }

        const line = await this._repository.findOne(id);
        if (!line) {
            throw new NotFoundException(`Unable to find line with id '${id}'`);
        }
        const result = await this._repository.remove(line);
        return result;
    }

    public async updateLine(id: string, text: string, userId: string, storyId: string): Promise<Line> {
        if (!id) {
            throw new BadRequestException(`missing id parameter`);
        }

        if (!text && !userId && !storyId) {
            throw new BadRequestException(`no parameters to update`);
        }

        const line = await this._repository.findOne(id);
        if (!line) {
            throw new NotFoundException(`Unable to find line with id '${id}'`);
        }
        if (text) {
            line.text = text;
        }

        if (userId) {
            line.userId = userId;
        }

        if (storyId) {
            line.storyId = storyId;
        }

        const result = await this._repository.save(line);
        return result;
    }
}
