module.exports = function (app) {

    app.get('/users/:id', (req, res) => {
        const lel = req.query.lelel
        return res.status(404).send(false)

    })

    app.get('/ping', (req, res) => {
        res.send('pong.')
    });

    app.post('/test', (req, res) => {
        res.status(201).send('pong.');
    });

}