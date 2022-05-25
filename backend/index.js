require('dotenv').config();
const express = require('express');
const sequelize = require('./db');
const models = require('./models/models');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const router = require('./routes/index');
const errorHandler = require('./middleware/ErrorHandlingMiddleware');
const path = require('path');
const swaggerUI = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json')

const PORT = process.env.PORT || 5010;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use('/api', router);
app.use(fileUpload({}));
app.use('/doc', swaggerUI.serve, swaggerUI.setup(swaggerFile));
app.use(errorHandler); //обработка ошибок, последний middleware

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => console.log(`SERVER STARTED ON PORT ${PORT}`));
    } catch (e) {
        console.log(e);
    }
}

start();