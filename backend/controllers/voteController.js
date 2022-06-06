const contestData = require('../settings.json');
const {Point, Jury, Stage} = require("../models/models");
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

            if (Object.keys(points).filter(p => points[p]).length !== contestData.pointsSystem.length) {
                return next(ApiError.badRequest('Поставьте все баллы!'))
            }

            const isVoted = await Point.findAll({
                where: {
                    userId: req.user.id,
                    stageId: id
                }
            });

            if (isVoted.length === contestData.pointsSystem.length) {
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