const sequelize = require('../db');
const {DataTypes} = require('sequelize');

//Пользователь
const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    vk: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    name: {type: DataTypes.STRING},
    surname: {type: DataTypes.STRING},
    alias: {type: DataTypes.STRING},
    isActive: {type: DataTypes.BOOLEAN, defaultValue: true},
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

//Сезон конкурса
const Season = sequelize.define('season', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    description: {type: DataTypes.STRING},
    dateStart: {type: DataTypes.DATE},
    dateEnd: {type: DataTypes.DATE},
});

//Стадия конкурса
const Stage = sequelize.define('stage', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    prevStage: {type: DataTypes.INTEGER},
    nextStage: {type: DataTypes.INTEGER},
    secondChanceStage: {type: DataTypes.INTEGER},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    winCount: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 1},
    secondChanceCount: {type: DataTypes.INTEGER, defaultValue: 0},
    juryPercent: {type: DataTypes.FLOAT, allowNull: false},
});

//Стадии сезона
const StageSeason = sequelize.define('stage_season', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
});

//Жюри
const Jury = sequelize.define('jury', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    description: {type: DataTypes.STRING},
});

//Заявка
const Application = sequelize.define('application', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    originalSongName: {type: DataTypes.STRING, allowNull: false},
    songName: {type: DataTypes.STRING, allowNull: false},
    audioFile: {type: DataTypes.STRING, allowNull: false},
});

//Пользователи заявки
const ApplicationUser = sequelize.define('application_user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
});

//Статус
const ApplicationState = sequelize.define('application_state', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    description: {type: DataTypes.STRING},
});

//Дисквалификация
const Dsq = sequelize.define('dsq', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    description: {type: DataTypes.STRING},
});

//Балл
const Point = sequelize.define('point', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    isConfirmed: {type: DataTypes.BOOLEAN, defaultValue: false},
    points: {type: DataTypes.INTEGER, defaultValue: 0, allowNull: false}
});

User.belongsToMany(Role, {through: UserRole});
Role.belongsToMany(User, {through: UserRole});

Season.belongsToMany(Stage, {through: StageSeason});
Stage.belongsToMany(Season, {through: StageSeason});

User.belongsToMany(Stage, {through: Jury});
Stage.belongsToMany(User, {through: Jury});

User.belongsToMany(Application, {through: ApplicationUser});
Application.belongsToMany(User, {through: ApplicationUser});

Season.belongsToMany(User, {through: Dsq});
User.belongsToMany(Season, {through: Dsq});

Season.hasMany(Application);
Application.belongsTo(Season);

Season.hasMany(Application);
Application.belongsTo(Season);

ApplicationState.hasMany(Application);
Application.belongsTo(ApplicationState);

Application.hasMany(Point);
Point.belongsTo(Application);

Stage.hasMany(Point);
Point.belongsTo(Stage);

User.hasMany(Point);
Point.belongsTo(User);
//
// Role.create({name: 'USER'});
// Role.create({name: 'ADMIN'});
// Role.create({name: 'ORGANIZER'});

module.exports = {
    User,
    Role,
    UserRole,
    Season,
    Stage,
    Dsq,
    Jury,
    ApplicationState,
    Application,
    ApplicationUser,
    StageSeason,
    Point
}