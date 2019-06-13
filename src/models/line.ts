import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Repository } from "typeorm";

import Story from "./story";
import User from "./user";

@Entity()
export default class Line {

    @PrimaryGeneratedColumn(`uuid`)
    public id: string;

    @Column({ nullable: false })
    public text: string;

    @Column({ nullable: true })
    public userId: string;

    @ManyToOne((type) => User, (user) => user.lines, { nullable: false })
    @JoinColumn({ name: `userId` })
    public user: User;

    @Column({ nullable: true })
    public storyId: string;

    @ManyToOne((type) => Story, (story) => story.lines, { nullable: false })
    @JoinColumn({ name: `storyId` })
    public story: Story;
}
