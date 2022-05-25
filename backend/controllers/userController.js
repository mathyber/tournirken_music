const ApiError = require('../error/apiError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User, UserRole, Role} = require('../models/models');

const generateJwt = (id, email, roles=[]) => {
    return jwt.sign(
        {id, email, roles},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
};

class UserController {
    async registration(req, res, next) {
        const {email, password, vk} = req.body;
        if (!email || !password) {
            return next(ApiError.badRequest('Некорректный email или пароль!'));
        }
        const candidate = await User.findOne({where: {email}});
        if (candidate) {
            return next(ApiError.badRequest('Email уже занят'));
        }
        const hashPassword = await bcrypt.hash(password, 5);
        const user = await User.create({email, password: hashPassword, vk});
        const role = await Role.findOne({where: {name: 'USER'}});
        await UserRole.create({userId: user.id, roleId: role.id});

        const token = generateJwt(user.id, email, ['USER']);
        return res.json({token});
        //const roleUser = await UserRole.create({});
    };

    async login(req, res, next) {
        const {email, password} = req.body;
        const user = await User.findOne({where: {email}});
        if (!user) {
            return next(ApiError.internal('Пользователь не найден'));
        }
        let comparePassword = bcrypt.compareSync(password, user.password);
        if (!comparePassword) {
            return next(ApiError.internal('Пароль неверный'));
        }
        const roles = await UserRole.findAll({where: {userId: user.id}});
        const rolesIdArray = roles.map(r => r.roleId);
        const rolesNames = [];
        for (const r of rolesIdArray) {
            const role = await Role.findOne({where: {id: r}});
            rolesNames.push(role.name);
        }
        const token = generateJwt(user.id, email, rolesNames);
        return res.json({token});
    };

    async check(req, res, next) {
        // const {id} = req.query;
        // if (!id) {
        //     return next(ApiError.badRequest('Нет ID'));
        // }
        const token = generateJwt(req.user.id, req.user.email);
        res.json({token});
    };
}

module.exports = new UserController();