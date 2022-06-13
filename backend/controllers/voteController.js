const contestData = require('../settings.json');
const {Point, Jury, Stage, Application, ApplicationStage, ApplicationState} = require("../models/models");
const ApiError = require("../error/apiError");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

class VoteController {
    async voteSystem(req, res, next) {
        // #swagger.tags = ['Vote']

        try {

            const {id} = req.body;

            const isJury = await Jury.findOne({
                where: {
                    [Op.and]: [
                        {userId: req.user.id},
                        {stageId: id}
                    ]
                }
            });

            const stage = await Stage.findOne({
                where: {id}
            });

            return res.json({
                points: contestData.pointsSystem,
                isJury: !!isJury,
                voteOpen: ((Date.parse(stage.endVote) > Date.parse(new Date())) || !stage.endVote)
                    && (Date.parse(stage.startVote) < Date.parse(new Date()))
            });
        } catch (err) {
            next(err)
        }
    };

    async vote(req, res, next) {
        // #swagger.tags = ['Vote']
        try {

            const {id} = req.params;
            const {points} = req.body;

            const stage = await Stage.findOne({
                where: {id},
                include: [{model: Application, as: 'applications'}]
            });

            if (!stage) return next(ApiError.internal('Сезона нет'));

            const dsqStatus = await ApplicationState.findOne({
                where: {name: 'DSQ'}
            });

            console.log(stage.applications.filter(a => a.applicationStateId !== dsqStatus.id).length)

            const appsCount = stage.applications.filter(a => a.applicationStateId !== dsqStatus.id).length;

            const count = appsCount < contestData.pointsSystem.length ? appsCount : contestData.pointsSystem.length;

            if (Object.keys(points).filter(p => points[p]).length !== count) {
                return next(ApiError.badRequest('Поставьте все баллы!'))
            }

            const isVoted = await Point.findAll({
                where: {
                    userId: req.user.id,
                    stageId: id
                }
            });

            if (isVoted.length >= count) {
                return next(ApiError.badRequest('Вы уже проголосовали в этой стадии!'))
            }

            Object.keys(points).forEach(point => {
                Point.create({
                    stageId: id,
                    userId: req.user.id,
                    applicationId: points[point],
                    points: point
                })
            });

            return res.json({
                message: 'Голосование учтено!'
            });
        } catch (err) {
            console.log(err)
            next(err)
        }
    };

    async deleteVote(req, res, next) {
        // #swagger.tags = ['Vote']
        try {

            const {id, userId} = req.params;

            Point.destroy({
                where: {
                    [Op.and]: [
                        {userId},
                        {stageId: id}
                    ]
                }
            })

            return res.json({
                message: 'Успешно удалено!'
            });
        } catch (err) {
            console.log(err)
            next(err)
        }
    };
}

module.exports = new VoteController();