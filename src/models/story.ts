import { AllowNull, Column, HasMany, Length, Model, Table } from "sequelize-typescript";
import Line from "./line";

@Table
export default class Story extends Model<Story> {

    @AllowNull(false)
    @Length({min: 5, max: 254})
    @Column
    public name: string;

    @HasMany(() => Line)
    public lines: Line[];
}
