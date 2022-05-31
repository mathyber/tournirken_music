const uuid = require('uuid');
const path = require('path');
const {Application, ApplicationUser} = require("../models/models");
const ApiError = require("../error/apiError");

class ApplicationController {
    async newApplication(req, res, next) {
        // #swagger.tags = ['Application']
        try {
            const {season, originalSongName, songName, users} = req.body;
            const {audioFile} = req.files;
            let fileName = uuid.v4()+'_'+audioFile.name;
            audioFile.mv(path.resolve(__dirname, '..', 'static', fileName));

            const application = await Application.create({
                seasonId: season,
                originalSongName,
                songName,
                audioFile: fileName
            });
            const usersIds = JSON.parse(users);
            [req.user.id, ...usersIds].forEach(user => {
                console.log(user)
                ApplicationUser.create({
                    userId: user,
                    applicationId: application.id
                })
            });

            return res.json({
                application
            });
        } catch (err) {
            console.log(err)
            next(ApiError.badRequest(err))
        }

    };
}

module.exports = new ApplicationController();