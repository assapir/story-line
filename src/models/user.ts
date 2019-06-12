import { AllowNull, Column, HasMany, IsEmail, Model, Table, Unique } from "sequelize-typescript";
import Line from "./line";

@Table({indexes: [{fields: [`email`], unique: false}]})
export default class User extends Model<User> {

    @AllowNull(false)
    @Column
    public firstName: string;

    @AllowNull(false)
    @Column
    public lastName: string;

    @AllowNull(false)
    @IsEmail
    @Unique
    @Column
    public email: string;

    @HasMany(() => Line)
    public lines: Line[];
}
