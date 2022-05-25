const sequelize = require('../db');
const {DataTypes} = require('sequelize');

//Пользователь
const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    vk: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING}
});

//Роль
const Role = sequelize.define('role', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true},
});

//Роль - пользователь
const UserRole = sequelize.define('user_role', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
});

User.belongsToMany(Role, {through: UserRole});
Role.belongsToMany(User, {through: UserRole});

// Role.create({name: 'USER'});
// Role.create({name: 'ADMIN'});

module.exports = {
    User,
    Role,
    UserRole
}