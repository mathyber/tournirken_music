const contestData = require('../settings.json');

class ContestController {
    async contestData(req, res, next) {
        // #swagger.tags = ['Contest']
        try {
            return res.json({
                name: contestData.contestName,
                description: contestData.description,
            });
        } catch (err) {
            next(err)
        }

    };
}

module.exports = new ContestController();