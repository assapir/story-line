import { Application } from "express";
import { Connection, QueryRunner } from "typeorm";
import Line from "../src//models/line";
import Story from "../src/models/story";
import User from "../src/models/user";

export function setSimulateError(app: Application, path: string, error: Error) {
    app.all(path, () => {
        throw error;
    });
}

export async function seedDatabase(connection: Connection): Promise<[User, Story, Line[]]> {
    const queryRunner = connection.createQueryRunner();
    await connection.synchronize(true); // reset it
    const user = await seedUser(queryRunner);
    const story = await seedStory(queryRunner);
    const lines = await seedLines(queryRunner, user, story);
    return [user, story, lines];
}

async function seedUser(queryRunner: QueryRunner): Promise<User> {
    const userRepository = await queryRunner.connection.getRepository(User);
    const user = new User();
    user.firstName = `Assaf`;
    user.lastName = `Sapir`;
    user.email = `not@real.com`;
    const result = await userRepository.save(user);
    return result;
}

async function seedStory(queryRunner: QueryRunner): Promise<Story> {
    const storyRepository = await queryRunner.connection.getRepository(Story);
    const story = new Story();
    story.name = `what a heck of a story`;
    const result = await storyRepository.save(story);
    return result;
}

async function seedLines(queryRunner: QueryRunner, user: User, story: Story): Promise<Line[]> {
    const lineRepository = await queryRunner.connection.getRepository(Line);
    const firstLine = new Line();
    firstLine.text = `first line of text`;
    firstLine.user = user;
    firstLine.story = story;

    const secondLine = new Line();
    secondLine.text = `second line of text`;
    secondLine.userId = user.id;
    secondLine.storyId = story.id;

    const result = await lineRepository.save([firstLine, secondLine]);
    return result;
}
