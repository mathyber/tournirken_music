const uuid = require('uuid');
const path = require('path');
const {Application, ApplicationUser, User, ApplicationState} = require("../models/models");
const ApiError = require("../error/apiError");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

class ApplicationController {
    async newApplication(req, res, next) {
        // #swagger.tags = ['Application']
        try {
            const {season, originalSongName, songName, users} = req.body;
            const {audioFile} = req.files;
            let fileName = uuid.v4() + '_' + audioFile.name;
            audioFile.mv(path.resolve(__dirname, '..', 'static', fileName));

            const state = await ApplicationState.findOne({
                where: {name: 'NEW'}
            })

            const application = await Application.create({
                seasonId: parseInt(JSON.parse(season)),
                originalSongName: JSON.parse(originalSongName),
                songName: JSON.parse(songName),
                audioFile: fileName,
                applicationStateId: state.id
            });
            const usersIds = users ? JSON.parse(users) : [];
            [req.user.id, ...usersIds].forEach(user => {
                console.log(user)
                ApplicationUser.create({
                    userId: user,
                    applicationId: application.id
                })
            });

            return res.json({
                message: 'Заявка подана!',
                application
            });
        } catch (err) {
            console.log(err)
            next(ApiError.badRequest(err))
        }
    };


    async setStatusApplication(req, res, next) {
        // #swagger.tags = ['Application']
        try {
            const {id, newStatus} = req.body;

            const state = await ApplicationState.findOne({
                where: {name: newStatus}
            })

            const application = await Application.update({
                applicationStateId: state.id
            }, {
                where: {id}
            });

            return res.json({
                message: 'Статус обновлен!',
            });
        } catch (err) {
            console.log(err)
            next(ApiError.badRequest(err))
        }
    };


    async getApplications(req, res, next) {
        // #swagger.tags = ['Application']

        try {
            let {seasonId, limit, page, state} = req.body;
            page = page || 1;
            limit = limit || 10;
            state = state || null;
            let offset = (page * limit) - limit;
            let apps;

            let arrayAnd = [
                {seasonId}
            ];

            if (state) {
                const stateData = await ApplicationState.findOne({
                    where: {name: state}
                })
                arrayAnd.push({applicationStateId: stateData.id});
            }

            apps = await Application.findAndCountAll({
                where: {
                    [Op.and] : arrayAnd
                },
                include: [
                    {
                        model: User,
                        as: 'users',
                        attributes: ['id', 'email', 'vk', 'name', 'surname', 'alias']
                    },
                    {
                        model: ApplicationState,
                        as: 'application_state'
                    },
                ],
                order: [
                    ['id', 'DESC']
                ],
                limit,
                offset
            });

            return res.json(apps);
        } catch (err) {
            console.log(err);
            next(err)
        }
    }

    async getApplication(req, res, next) {
        // #swagger.tags = ['Application']

        try {
            let {id} = req.params;

            let app = await Application.findOne({
                where: {
                    id
                },
                include: [{model: User, as: 'users'}],
            });

            return res.json(app);
        } catch (err) {
            console.log(err);
            next(err)
        }
    }

}

module.exports = new ApplicationController();