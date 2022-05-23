const express = require('express');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const app = express();

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Tournirken Music API',
            version: '1.0.0',
            description: '---'
        }
    },
    apis: ['app.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

/**
 * @swagger
 * /ping:
 *  get:
 *    description: Ping
 *    responses:
 *      200:
 *        description: Success
 */
app.get('/ping', (req, res) => {
    res.send('pong.')
});

/**
 * @swagger
 * /test:
 *  post:
 *    description: Create test
 *    parameters:
 *    - name: title
 *      description: test title
 *      in: formData
 *      required: true
 *      type: string
 *    responses:
 *      201:
 *        description: Created
 */
app.post('/test', (req, res) => {
    res.status(201).send('pong.');
});

app.listen(5000, () => console.log('port 5000'))