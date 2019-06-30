import { QueryFailedError, Repository } from "typeorm";
import BadRequestException from "../exceptions/badRequestException";
import NotAllowedException from "../exceptions/notAllowedException";
import NotFoundException from "../exceptions/notFoundException";
import Line from "../models/line";
import Story from "../models/story";

export default class StoryService {
    private readonly _repository: Repository<Story>;

    constructor(repository: Repository<Story>) {
        this._repository = repository;
    }

    public async getStory(id: string): Promise<Story> {
        if (!id) {
            throw new BadRequestException(`missing id parameter`);
        }

        const story = await this._repository.findOne(id);
        if (!story) {
            throw new NotFoundException(`Unable to find story with id '${id}'`);
        }

        return story;
    }

    public async getAllStories(): Promise<Story[]> {
        const stories = await this._repository.find();
        if (!stories || stories.length === 0) {
            throw new NotFoundException(`No stories found`);
        }

        return stories;
    }

    public async createStory(name: string): Promise<Story> {
        if (!name) {
            throw new BadRequestException(`missing name parameter`);
        }

        const story = new Story();
        story.name = name;
        return await this._repository.save(story);
    }

    public async deleteStory(id: string): Promise<Story> {
        try {
            if (!id) {
                throw new BadRequestException(`missing id parameter`);
            }

            const story = await this._repository.findOne(id);
            if (!story) {
                throw new NotFoundException(`Unable to find story with id '${id}'`);
            }
            return await this._repository.remove(story);
        } catch (error) {
            if (error instanceof QueryFailedError) {
                throw new NotAllowedException(`Can't delete story that has lines`);
            }
            throw error;
        }
    }

    public async resetStory(id: string): Promise<Story> {
        if (!id) {
            throw new BadRequestException(`missing id parameter`);
        }
        const story = await this._repository.findOne(id);
        if (!story) {
            throw new NotFoundException(`Unable to find story with id '${id}'`);
        }
        story.lines = [];
        return await this._repository.save(story);
    }

    public async updateStoryName(id: string, newName: string): Promise<Story> {
        if (!id) {
            throw new BadRequestException(`missing id parameter`);
        }

        if (!newName) {
            throw new BadRequestException(`missing newName parameter`);
        }

        const story = await this._repository.findOne(id);
        if (!story) {
            throw new NotFoundException(`Unable to find story with id '${id}'`);
        }
        story.name = newName;
        return await this._repository.save(story);
    }
}
