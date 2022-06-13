const {Point, User, Application, Jury, ApplicationState, Stage, ApplicationStage, Season, Dsq} = require("../models/models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const contestData = require('../settings.json');
const ApiError = require("../error/apiError");

async function resultCalc(id, juries = [], next) {
    let result = [];

    // const status = await ApplicationState.findOne({
    //     where: {name: 'IN_CONTEST'}
    // });

    const stage = await Stage.findOne({
        where: {id},
        include: [
            {model: Season, as: 'season'},
            {model: Application, as: 'applications'},
            {
                model: User,
                as: 'users',
                attributes: ['id', 'email', 'vk', 'name', 'surname']
            },
        ]
    });

    if (!stage) return next(ApiError.badRequest('Стадия не существует'));

    let pointsAll = [];

    const dsqStatus = await ApplicationState.findOne({
        where: {name: 'DSQ'}
    });

    let stApps = stage.applications//.filter(a => a.applicationStateId.toString() !== dsqStatus.id.toString());

    if (stage.juryPercent !== 0) {
        for (const juryId of juries) {

            let pointsAllItem = {}

            const pointsData = await Point.findAll({
                where: {stageId: id, userId: juryId}
            });

            let points = contestData.pointsSystem.map(point => ({
                points: point,
                app: (pointsData.find(pd => pd.userId === juryId && pd.points === point) || {}).applicationId
            }));

            stApps.forEach(app => {
                pointsAllItem[app.id] = (([...pointsAll].pop() || {})[app.id] || 0) + (points.find(p => p.app === app.id) || {}).points
            })

            pointsAll.push(pointsAllItem);

            result.push({
                user: stage.users.find(u => u.id === juryId),
                isJury: true,
                points,
                pointsAll: Object.keys(pointsAllItem).map(key => ({
                    points: pointsAllItem[key] || 0,
                    app: key
                })).sort(
                    function (a, b) {
                        if (a.points > b.points) {
                            return -1;
                        }
                        if (a.points < b.points) {
                            return 1;
                        }
                        return 0;
                    }
                )
            })
        }
    }

    let votePoints = {}

    let pointsData = [];

    if (stage.juryPercent !== 0) pointsData = await Point.findAll({
        where: {
            stageId: id,
            [Op.not]:
                [{userId: juries}]
        }
    });

    if (stage.juryPercent === 0) pointsData = await Point.findAll({
        where: {
            stageId: id
        }
    });

    stApps.forEach(app => {
        votePoints[app.id] = pointsData.filter(pD => pD.applicationId === app.id).map(p => p.points || 0)
            .reduce(function (sum, elem) {
                return sum + elem;
            }, 0);
    })

    const juryPointsSum = stage.juryPercent !== 0 ? [...result].pop().pointsAll.map(p => p.points).reduce(function (sum, elem) {
        return sum + elem;
    }, 0) : 0;

    const notJuryPointsSum = ((juryPointsSum * 100) / stage.juryPercent) - juryPointsSum;

    const notJuryPointsSumFact = Object.keys(votePoints).map(key => votePoints[key]).reduce(function (sum, elem) {
        return sum + elem;
    }, 0);

    const proc = stage.juryPercent !== 0 ? ((notJuryPointsSumFact * 100) / notJuryPointsSum) : 100;

    let pVotes = Object.keys(votePoints).map(key => ({
        points: Math.round((votePoints[key] * 100) / proc),
        app: key
    })).sort(
        function (a, b) {
            if (a.points > b.points) {
                return -1;
            }
            if (a.points < b.points) {
                return 1;
            }
            return 0;
        }
    );

    result.push({
        isJury: false,
        points: pVotes,
        pointsAll: pVotes.map(pV => ({
            points: pV.points + (stage.juryPercent !== 0 ? [...result].pop().pointsAll.find(p => p.app.toString() === pV.app.toString()).points : 0),
            app: pV.app
        })).sort(
            function (a, b) {
                if ((a.points > b.points)) {
                    return -1;
                }
                if (a.points < b.points) {
                    return 1;
                }
                return 0;
            }
        )
    });

    return {
        stage,
        result
    };
}


class ResultController {

    async result(req, res, next) {
        // #swagger.tags = ['Result']
        try {
            const {id} = req.params;
            const {juries = []} = req.body;

            const result = await resultCalc(id, juries, next);

            //let {reslt, stage} = result;

            // const dsqStatus = await ApplicationState.findOne({
            //     where: {name: 'DSQ'}
            // });
            //
            // let arrayDsq = stage.applications.filter(a => a.applicationStateId === dsqStatus.id);
            //
            // if (arrayDsq && arrayDsq.length) reslt = reslt.filter(r => arrayDsq.map(a => a.id.toString()).includes(r.app.toString()));

            return res.json(result);
        } catch (err) {
            console.log(err)
            next(err)
        }

    };

    async resultSave(req, res, next) {
        // #swagger.tags = ['Result']
        try {
            const {id} = req.params;
            //const {juries = []} = req.body;

            const juries = await Jury.findAll({
                where: {stageId: id}
            })

            const result = await resultCalc(id, juries.map(j => j.userId), next);

            let {result: reslt, stage} = result;

            await Stage.update({
                resultsApproved: true
            }, {
                where: {id: stage.id}
            })

            const dsqStatus = await ApplicationState.findOne({
                where: {name: 'DSQ'}
            });

            let arrayDsq = stage.applications.filter(a => a.applicationStateId === dsqStatus.id);

            if (arrayDsq && arrayDsq.length) reslt = reslt.filter(r => arrayDsq.map(a => a.id.toString()).includes(r.app.toString()));

            for (let i = 0; i < stage.winCount; i++) {
                const appId = [...reslt].pop().pointsAll[i].app;

                stage.nextStage && await ApplicationStage.create({
                    stageId: stage.nextStage,
                    applicationId: appId
                })
            }

            for (let i = stage.winCount; i < stage.winCount + stage.secondChanceCount; i++) {
                const appId = [...reslt].pop().pointsAll[i].app;

                stage.secondChanceStage && await ApplicationStage.create({
                    stageId: stage.secondChanceStage,
                    applicationId: appId
                })
            }

            return res.json({
                message: 'Результаты сохранены'
            });
        } catch (err) {
            console.log(err)
            next(err)
        }

    };

    async resultTable(req, res, next) {
        // #swagger.tags = ['Result']
        try {
            const {id} = req.params;
            let {isJury, limit, page} = req.body;
            page = page || 1;
            limit = limit || 10;
            //let offset = (page * limit) - limit;

            const pointsData = await Point.findAll({
                where: {
                    [Op.and]: [
                        {stageId: id},
                    ]
                }
            });

            const juries = await Jury.findAll({
                where: {
                    stageId: id
                }
            });

            const juryIds = juries.map(j => j.userId)

            const voters = [...new Set(pointsData.map(pd => pd.userId))].filter(voter => isJury ? juryIds.includes(voter) : !juryIds.includes(voter));

            const votersPage = voters.slice(page - 1, page - 1 + limit);


            let data = [];

            for (const voter of votersPage) {

                let user = await User.findOne({
                    where: {id: voter},
                    attributes: ['id', 'email', 'vk', 'name', 'surname']
                });

                data.push({
                    user,
                    points: contestData.pointsSystem.map(point => ({
                        points: point,
                        app: pointsData.find(pd => pd.userId === voter && pd.points === point)
                    }))
                })
            }

            return res.json({rows: data, count: voters.length});
        } catch (err) {
            console.log(err)
            next(err)
        }

    };

}

module.exports = new ResultController();