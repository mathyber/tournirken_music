const ApiError = require('../error/apiError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User, UserRole, Role} = require('../models/models');

const generateJwt = (id, email, roles=[], name, surname) => {
    return jwt.sign(
        {id, email, roles, name, surname},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
};

class UserController {
    async registration(req, res, next) {
        // #swagger.tags = ['User']
        const {email, password, vk, name, surname} = req.body;
        if (!email || !password) {
            return next(ApiError.badRequest('Некорректный email или пароль!'));
        }
        const candidate = await User.findOne({where: {email}});
        if (candidate) {
            return next(ApiError.badRequest('Email уже занят'));
        }
        const hashPassword = await bcrypt.hash(password, 5);
        const user = await User.create({email, password: hashPassword, vk, name, surname});
        const role = await Role.findOne({where: {name: 'USER'}});
        await UserRole.create({userId: user.id, roleId: role.id});

        const token = generateJwt(user.id, email, ['USER'], name, surname);
        return res.json({token});
        //const roleUser = await UserRole.create({});
    };

    async login(req, res, next) {
        // #swagger.tags = ['User']
        const {email, password} = req.body;
        const user = await User.findOne({where: {email}});
        if (!user) {
            return next(ApiError.forbidden('Пользователь не найден'));
        }
        let comparePassword = bcrypt.compareSync(password, user.password);
        if (!comparePassword) {
            return next(ApiError.forbidden('Пароль неверный'));
        }
        const roles = await UserRole.findAll({where: {userId: user.id}});
        const rolesIdArray = roles.map(r => r.roleId);
        const rolesNames = [];
        for (const r of rolesIdArray) {
            const role = await Role.findOne({where: {id: r}});
            rolesNames.push(role.name);
        }
        const token = generateJwt(user.id, email, rolesNames, user.name, user.surname);
        return res.json({token});
    };

    async profile(req, res, next) {
        // #swagger.tags = ['User']
        const user = await User.findOne({where: {id: req.user.id}});
        const roles = await UserRole.findAll({where: {userId: user.id}});
        const rolesIdArray = roles.map(r => r.roleId);
        const rolesNames = [];
        for (const r of rolesIdArray) {
            const role = await Role.findOne({where: {id: r}});
            rolesNames.push(role.name);
        }

        let userData = {
            id: user.id,
            vk: user.vk,
            email: user.email,
            roles: rolesNames
        }

        res.json(userData);
    };

    async check(req, res, next) {
        // #swagger.tags = ['User']

        // const {id} = req.query;
        // if (!id) {
        //     return next(ApiError.badRequest('Нет ID'));
        // }
        const roles = await UserRole.findAll({where: {userId: user.id}});
        const rolesIdArray = roles.map(r => r.roleId);
        const rolesNames = [];
        for (const r of rolesIdArray) {
            const role = await Role.findOne({where: {id: r}});
            rolesNames.push(role.name);
        }
        const token = generateJwt(req.user.id, req.user.email, rolesNames, req.user.name, req.user.surname);
        res.json({token});
    };
}

module.exports = new UserController();