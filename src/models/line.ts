import {
    Sequelize,
    DataTypes
} from 'sequelize';

export interface LineAttributes {
    text : string;

}

export interface LineInstance {
    id: number;
    createdAt: Date;
    updatedAt: Date;

    text: string;

}

export = (sequelize: Sequelize, DataTypes: DataTypes) => {
    var Line = sequelize.define('Line', {
        text: DataTypes.STRING
    });

    Line.associate = function(models) {
        // associations can be defined here
    };

    return Line;
};
