import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Line from "./line";

@Entity()
export default class Story {
    @PrimaryGeneratedColumn(`uuid`)
    public id: string;

    @Column({ nullable: false })
    public name: string;

    @OneToMany((type) => Line, (line) => line.story, {
        eager: true,
      })
    public lines: Line[];
}
