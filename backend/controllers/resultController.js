const {Point, User, Application, Jury} = require("../models/models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const contestData = require('../settings.json');

class ResultController {
    async result(req, res, next) {
        // #swagger.tags = ['Result']
        try {
            const {id} = req.params;
            const {} = req.body;



            return res.json({
                id: id,
               // message: ')'
            });
        } catch (err) {
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

            const voters = [...new Set(pointsData.map(pd=>pd.userId))].filter(voter => isJury ? juryIds.includes(voter) : !juryIds.includes(voter));

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