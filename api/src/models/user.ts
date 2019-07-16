import argon2 from "argon2";
import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Line from "./line";

export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
}

export enum Role {
    USER = 0,
    ADMIN = 1,
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
    public password: string;

    @Column({ nullable: false, default: Role.USER, type: Number })
    public role: Role;

    @OneToMany((type) => Line, (line) => line.user, {
        eager: true,
    })
    public lines: Line[];

    public async createOrUpdatePassword(password: string): Promise<void> {
        const encrypted = await argon2.hash(password);
        this.password = encrypted;
    }

    public async isPasswordCorrect(passwordAttempt: string): Promise<boolean> {
        return await argon2.verify(this.password, passwordAttempt);
    }
}
