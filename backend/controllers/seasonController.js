const {Season, Stage, ApplicationState, Application, ApplicationStage, User, ApplicationUser, Jury} = require("../models/models");
const Sequelize = require("sequelize");
const ApiError = require("../error/apiError");
const Op = Sequelize.Op;

class SeasonController {
    async createOrEditSeason(req, res, next) {
        // #swagger.tags = ['Season']
        try {
            let {id, name, description, dateStart, dateEnd, final, semifinals, secondChance} = req.body;

            let season = id ? await Season.findOne({
                where: {id},
                include: [{model: Stage, as: 'stages'}]
            }) : null;

            if (id && !season) return next(ApiError.badRequest('Сезон не найден'))

            if (season) {
                await Season.update({
                    name, description, dateStart, dateEnd
                }, {
                    where: {id: season.id},
                });
            } else {
                season = await Season.create({name, description, dateStart, dateEnd});
            }

            if (final || semifinals || secondChance) {
                //console.log(stages)
                //let {final, semifinals, secondChance} = stages;
                let finalStage = final.id ? await Stage.findOne({where: {id: final.id}}) : null;

                if (final) {
                    let {id, name, juryPercent = 0, count, endVote, startVote} = final;
                    if (finalStage) {
                        await Stage.update({
                            name, juryPercent, count, startVote, endVote
                        }, {
                            where: {id}
                        });
                    } else finalStage = await Stage.create({
                        name,
                        juryPercent,
                        nextStage: null,
                        secondChanceStage: null,
                        winCount: 1,
                        secondChanceCount: null,
                        count,
                        seasonId: season.id,
                        endVote, startVote
                    });

                    let schStage;
                    if (secondChance) {
                        schStage = secondChance.id ? await Stage.findOne({where: {id: secondChance.id}}) : null;
                        let {id, name, juryPercent = 0, winCount, count, endVote, startVote} = secondChance;

                        if (schStage) {
                            await Stage.update({
                                name,
                                juryPercent,
                                winCount,
                                count,
                                endVote,
                                startVote
                            }, {
                                where: {id}
                            })
                        } else {
                            schStage = await Stage.create({
                                name,
                                juryPercent,
                                nextStage: finalStage.id,
                                secondChanceStage: null,
                                winCount,
                                secondChanceCount: null,
                                count,
                                seasonId: season.id,
                                endVote, startVote
                            })
                        }
                    }
                    if (semifinals && semifinals.length) {
                        semifinals.forEach(sf => {
                            let {
                                id,
                                name,
                                juryPercent = 0,
                                winCount,
                                secondChanceCount,
                                secondChanceStage,
                                count,
                                endVote,
                                startVote
                            } = sf;
                            let sfStage = sf.id ? Stage.findOne({where: {id: sf.id}}) : null;
                            if (sfStage) {
                                Stage.update({
                                    name,
                                    juryPercent,
                                    secondChanceCount,
                                    secondChanceStage: (secondChanceStage || secondChanceCount) ? schStage.id : null,
                                    count,
                                    winCount,
                                    nextStage: finalStage.id,
                                    endVote, startVote
                                }, {
                                    where: {id}
                                });
                            } else Stage.create({
                                name,
                                juryPercent,
                                secondChanceCount,
                                secondChanceStage: (secondChanceStage || secondChanceCount) ? schStage.id : null,
                                count,
                                winCount,
                                nextStage: finalStage.id,
                                seasonId: season.id,
                                endVote, startVote
                            });

                        })
                    }
                }
            }

            season.stages?.forEach(s => {
                if ((!final || final.id !== s.id) && (!secondChance || secondChance.id !== s.id) && !semifinals.find(sf => sf.id === s.id)) {
                    Stage.destroy({
                        where: {id: s.id}
                    });
                }
            })

            season = await Season.findOne({
                where: {id: id || season.id},
            });

            return res.json({
                message: id ? 'Успешно отредактирован' : 'Сезон успешно создан!',
                season
            });

        } catch (err) {
            console.log(err)
            next(err)
        }
    };

    async getSeasons(req, res, next) {
        // #swagger.tags = ['Season']

        try {
            let {search, limit, page} = req.body;
            search = search || '';
            page = page || 1;
            limit = limit || 10;
            let offset = page * limit - limit;
            let seasons;

            seasons = await Season.findAndCountAll({
                where: {
                    [Op.or]: [
                        {name: {[Op.like]: `%${search}%`}},
                        {description: {[Op.like]: `%${search}%`}},
                    ],

                },
                order: [
                    ['id', 'DESC']
                ],
                limit,
                offset
            });

            return res.json(seasons);
        } catch (err) {
            console.log(err);
            next(err)
        }
    }

    async getSeason(req, res, next) {
        // #swagger.tags = ['Season']
        try {
            let {id} = req.params;

            const season = await Season.findOne({
                where: {id},
                include: [{model: Stage, as: 'stages'}]
            });

            if (!season) return next(ApiError.badRequest('Сезон не существует'));

            return res.json(season);
        } catch (err) {
            console.log(err);
            next(err)
        }
    }

    async setJury(req, res, next) {
        // #swagger.tags = ['Season']
        try {
            let {id} = req.params;
            let {juries} = req.body;

            juries.forEach(jury => {
                Jury.create({
                    stageId: id,
                    userId: jury
                });
            })

            return res.json({
                message: 'Состав жюри сохранен!'
            });
        } catch (err) {
            console.log(err);
            next(err)
        }
    }

    async getStage(req, res, next) {
        // #swagger.tags = ['Season']
        try {
            let {id} = req.params;

            let stage = await Stage.findOne({
                where: {id},
                include: [
                    {model: Season, as: 'season'},
                    {model: Application, include: [{model: User, as: 'users'}], as: 'applications'},
                    {model: User, as: 'users'},
                ]
            });

            if (!stage) return next(ApiError.badRequest('Стадия не существует'));

            return res.json(stage);
        } catch (err) {
            console.log(err);
            next(err)
        }
    }

    async setStage(req, res, next) {
        // #swagger.tags = ['Season']
        try {
            let {id} = req.params;
            let {apps} = req.body;

            const stage = await Stage.findOne({
                where: {id},
            });

            if (!stage) return next(ApiError.badRequest('Стадия не существует'));

            apps.forEach(app => {

                ApplicationStage.create({
                    stageId: id,
                    applicationId: app.app,
                    number: app.number
                })

                const state = ApplicationState.findOne({
                    where: {name: 'IN_CONTEST'}
                })

                Application.update({
                    applicationStateId: state.id,
                }, {
                    where: {
                        id: app.app
                    }
                })
            })

            return res.json({
                message: 'Сохранено!'
            });
        } catch (err) {
            console.log(err);
            next(err)
        }
    }

// async getSeasons(req, res, next) {
// #swagger.tags = ['Season']
//     try {
//
//     } catch (err) {
//         console.log(err);
//         next(err)
//     }
// }
}

module.exports = new SeasonController();