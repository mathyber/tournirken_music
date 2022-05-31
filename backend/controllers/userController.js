const ApiError = require('../error/apiError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User, UserRole, Role} = require('../models/models');
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const generateJwt = (id, email, roles = [], name, surname, isActive) => {
    return jwt.sign(
        {id, email, roles, name, surname, isActive},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
};

class UserController {
    async registration(req, res, next) {
        // #swagger.tags = ['User']
        try {
            const {email, password, vk, name, surname} = req.body;
            if (!email || !password || password === "") {
                return next(ApiError.badRequest('Некорректный email или пароль!'));
            }
            const candidate = await User.findOne({where: {email}});
            if (candidate) {
                return next(ApiError.badRequest('Email уже занят'));
            }
            const hashPassword = await bcrypt.hash(password, 5);
            const user = await User.create({email, password: hashPassword, vk: vk || null, name, surname});
            const role = await Role.findOne({where: {name: 'USER'}});
            await UserRole.create({userId: user.id, roleId: role.id});

            const token = generateJwt(user.id, email, ['USER'], name, surname, true);
            return res.json({
                message: 'Пользователь успешно зарегистрирован',
                token
            });
        } catch (err) {
            next(err)
        }

    };

    async update(req, res, next) {
        // #swagger.tags = ['User']
        try {
            const {email, alias, vk, name, surname} = req.body;
            await User.update({
                email, alias: alias || '', vk: vk || '', name, surname
            }, {
                where: {id: req.user.id}
            });

            return res.json({
                message: 'Профиль обновлен',
            });
        } catch (err) {
            next(err)
        }

    };

    async changePassword(req, res, next) {
        // #swagger.tags = ['User']
        const {password, newPassword} = req.body;
        if (!password || !newPassword || newPassword === "") return next(ApiError.badRequest('Введите старый и новый пароли'));
        if (password === newPassword) return next(ApiError.badRequest('Пароли совпадают'));

        const user = await User.findOne({where: {id: req.user.id}});
        if (!user) return next(ApiError.forbidden('Пользователь не найден'));

        let comparePassword = bcrypt.compareSync(password, user.password);
        if (!comparePassword) {
            return next(ApiError.forbidden('Пароль неверный'));
        }

        const hashPassword = await bcrypt.hash(newPassword, 5);
        await User.update({
            password: hashPassword
        }, {
            where: {id: user.id}
        });

        const roles = await UserRole.findAll({where: {userId: user.id}});
        const rolesIdArray = roles.map(r => r.roleId);
        const rolesNames = [];
        for (const r of rolesIdArray) {
            const role = await Role.findOne({where: {id: r}});
            rolesNames.push(role.name);
        }
        const token = generateJwt(user.id, user.email, rolesNames, user.name, user.surname, user.isActive);
        return res.json({
            message: 'Пароль успешно изменен',
            token
        });

    }

    async login(req, res, next) {
        // #swagger.tags = ['User']
        const {email, password} = req.body;
        const user = await User.findOne({where: {email}});

        if (!user) return next(ApiError.forbidden('Пользователь не найден'));
        if (!user.isActive) return next(ApiError.forbidden('Пользователь заблокирован'));

        let comparePassword = bcrypt.compareSync(password, user.password);
        if (!comparePassword) return next(ApiError.forbidden('Пароль неверный'));

        const roles = await UserRole.findAll({where: {userId: user.id}});
        const rolesIdArray = roles.map(r => r.roleId);
        const rolesNames = [];
        for (const r of rolesIdArray) {
            const role = await Role.findOne({where: {id: r}});
            rolesNames.push(role.name);
        }
        const token = generateJwt(user.id, email, rolesNames, user.name, user.surname, user.isActive);
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
            roles: rolesNames,
            name: user.name,
            surname: user.surname,
            isActive: user.isActive,
            alias: user.alias
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
        const token = generateJwt(req.user.id, req.user.email, rolesNames, req.user.name, req.user.surname, req.user.isActive);
        res.json({token});
    };

    async user(req, res, next) {
        // #swagger.tags = ['User']
        const {id} = req.query;
        if (!id) return next(ApiError.badRequest('Нет ID'));

        const user = await User.findOne({where: {id}});
        if (!user) return next(ApiError.badRequest('Пользователь не найден'));

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
            roles: rolesNames,
            name: user.name,
            surname: user.surname,
            isActive: user.isActive,
            alias: user.alias
        }

        res.json(userData);
    };

    async setRole(req, res, next) {
        // #swagger.tags = ['User']
        try {
            const {id} = req.query;
            const {roleName} = req.body;
            if (!id) return next(ApiError.badRequest('Нет ID'));
            if (!roleName) return next(ApiError.badRequest('Нет роли'));

            const user = await User.findOne({where: {id}});
            if (!user) return next(ApiError.badRequest('Пользователь не найден'));

            const role = await Role.findOne({where: {name: roleName}});
            if (!role) return next(ApiError.badRequest('Роль не найдена'));

            await UserRole.destroy({where: {userId: user.id}});
            await UserRole.create({userId: user.id, roleId: role.id});

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
                roles: rolesNames,
                name: user.name,
                surname: user.surname,
                isActive: user.isActive,
                alias: user.alias
            }

            res.json(userData);
        } catch (err) {
            next(err)
        }

    };

    async deActive(req, res, next) {
        // #swagger.tags = ['User']
        try {
            const {id} = req.query;
            if (!id) return next(ApiError.badRequest('Нет ID'));

            const user = await User.findOne({where: {id}});
            if (!user) return next(ApiError.badRequest('Пользователь не найден'));

            await User.update({
                isActive: false
            }, {
                where: {id: user.id}
            })

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
                roles: rolesNames,
                name: user.name,
                surname: user.surname,
                isActive: user.isActive,
                alias: user.alias
            }

            res.json({
                message: 'Пользователь заблокирован',
                userData
            });
        } catch (err) {
            next(err)
        }
    };


    async getUsers(req, res, next) {
        // #swagger.tags = ['User']

        try {
            let {search, limit, page} = req.body;
            search = search || '';
            page = page || 1;
            limit = limit || 10;
            let offset = page * limit - limit;
            let users;

            users = await User.findAndCountAll({
                where: {
                    [Op.or]: [
                        {name: {[Op.like]: `%${search}%`}},
                        {surname: {[Op.like]: `%${search}%`}},
                        {alias: {[Op.like]: `%${search}%`}},
                    ]
                },
                limit,
                offset
            })

            return res.json(users);
        } catch (err) {
            console.log(err);
            next(err)
        }
    }
}

module.exports = new UserController();