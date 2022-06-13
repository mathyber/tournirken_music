const contestData = require('../settings.json');
const {Season} = require("../models/models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

class ContestController {
    async contestData(req, res, next) {
        // #swagger.tags = ['Contest']

        let date = Date.parse(new Date());

        let seasons = await Season.findAll({
            where: {
                [Op.and]: [
                    {dateEnd: {[Op.gt]: date}},
                    {dateStart: {[Op.lt]: date}},
                ],
            },
            order: [
                ['id', 'DESC']
            ]
        });


        try {
            return res.json({
                name: contestData.contestName,
                description: contestData.description,
                seasons
            });
        } catch (err) {
            next(err)
        }

    };
}

module.exports = new ContestController();