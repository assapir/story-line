import { AllowNull, BelongsTo, Column, ForeignKey, Length, Model, Table } from "sequelize-typescript";
import Story from "./story";
import User from "./user";

@Table
export default class Line extends Model<Line> {

    @AllowNull(false)
    @Length({min: 5, max: 254})
    @Column
    public text: string;

    @ForeignKey(() => User)
    @Column
    public userId: number;

    @BelongsTo(() => User)
    public user: User;

    @ForeignKey(() => Story)
    @Column
    public storyId: number;

    @BelongsTo(() => Story)
    public story: Story;
}
