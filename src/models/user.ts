import { IsEmail } from "class-validator"
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
    @IsEmail()
    public email: string;

    @OneToMany((type) => Line, (line) => line.user, {
        eager: true,
    })
    public lines: Line[];
}
