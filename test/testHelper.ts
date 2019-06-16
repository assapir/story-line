import { Application } from "express";
import faker from "faker";
import { Connection, QueryRunner } from "typeorm";
import Line from "../src//models/line";
import Story from "../src/models/story";
import User from "../src/models/user";

export function setSimulateError(app: Application, path: string, error: Error) {
    app.all(path, () => {
        throw error;
    });
}

export async function getUserById(connection: Connection, id: string): Promise<User> {
    const userRepository = connection.getRepository(User);
    return await userRepository.findOneOrFail(id);
}

export async function getStoryById(connection: Connection, id: string): Promise<Story> {
    const userRepository = connection.getRepository(Story);
    return await userRepository.findOneOrFail(id);
}

export async function seedDatabase(connection: Connection): Promise<[User, Story, Line[]]> {
    const queryRunner = connection.createQueryRunner();
    await connection.synchronize(true); // reset it
    const user = await seedUser(queryRunner);
    const story = await seedStory(queryRunner);
    const lines = [await seedLine(queryRunner, user, story), await seedLine(queryRunner, user, story)];
    return [user, story, lines];
}

export async function seedUser(queryRunner: QueryRunner): Promise<User> {
    const userRepository = await queryRunner.connection.getRepository(User);
    const user = new User();
    user.firstName = faker.name.firstName();
    user.lastName = faker.name.lastName();
    user.email = faker.internet.email(user.firstName, user.lastName);
    const result = await userRepository.save(user);
    return result;
}

export async function seedStory(queryRunner: QueryRunner): Promise<Story> {
    const storyRepository = await queryRunner.connection.getRepository(Story);
    const story = new Story();
    story.name = faker.lorem.slug(5);
    const result = await storyRepository.save(story);
    return result;
}

export async function seedLine(queryRunner: QueryRunner, user: User, story: Story): Promise<Line> {
    const lineRepository = await queryRunner.connection.getRepository(Line);
    const firstLine = new Line();
    firstLine.text = faker.lorem.slug(5);
    firstLine.user = user;
    firstLine.story = story;
    const result = await lineRepository.save(firstLine);
    return result;
}
