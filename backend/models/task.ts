import { DataTypes } from "sequelize";
import sequelize from "../database.ts";

const Task = sequelize.define('Task', {
    titlu: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descriere: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    prioritate: {
        type: DataTypes.STRING,
        allowNull: false
    },
    categorie: {
        type: DataTypes.STRING,
        allowNull: false
    },
    deadline: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    ora: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'tasks',
    timestamps: false
});

export default Task;