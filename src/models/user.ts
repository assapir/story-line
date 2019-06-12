import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Line from "./line";

@Entity()
export default class User {
    @PrimaryGeneratedColumn(`uuid`)
    public id: string;

    @Column({ nullable: false })
    public firstName: string;

    @Column({ nullable: false })
    public lastName: string;

    @Index({ unique: true })
    @Column({ nullable: false })
    public email: string;

    @OneToMany((type) => Line, (line) => line.user)
    public lines: Line[];
}
