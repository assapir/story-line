import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Line from "./line";

export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
}

@Entity()
export default class User implements IUser {
    @PrimaryGeneratedColumn(`uuid`)
    public id: string;

    @Column({ nullable: false })
    public firstName: string;

    @Column({ nullable: false })
    public lastName: string;

    @Index({ unique: true })
    @Column({ nullable: false })
    public email: string;

    @Column({ nullable: false })
    public saltedPassword: string;

    @Column({ nullable: false })
    public salt: string;

    @OneToMany((type) => Line, (line) => line.user, {
        eager: true,
    })
    public lines: Line[];
}
