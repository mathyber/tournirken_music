const express = require('express');
const swaggerUI = require('swagger-ui-express');
const http = require('http');
const swaggerFile = require('./swagger_output.json')

const app = express();

http.createServer(app).listen(3000)
console.log("Listening at:// port:%s (HTTP)", 3000)

app.use('/doc', swaggerUI.serve, swaggerUI.setup(swaggerFile))

require('./endpoints')(app);