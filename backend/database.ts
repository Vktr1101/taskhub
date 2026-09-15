import { Sequelize } from "sequelize";

const sequelize = new Sequelize('taskhub', 'root', 'taskhub123', {
    host: 'localhost',
    port: 3307,
    dialect: 'mysql'
});

export default sequelize;