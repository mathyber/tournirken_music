const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['./routes/index']

const doc = {
    info: {
        version: "1.0.0",
        title: "Tournirken Music API",
        description: "Documentation"
    },
    host: "localhost:5010/api",
    basePath: "/",
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        {
            "name": "User",
            "description": "Пользователь"
        },
        {
            "name": "Contest",
            "description": "Конкурс"
        },
        {
            "name": "Season",
            "description": "Сезон"
        },
        {
            "name": "Application",
            "description": "Заявка"
        }
    ],
    // securityDefinitions: {
    //     api_key: {
    //         type: "apiKey",
    //         name: "api_key",
    //         in: "header"
    //     },
    //     petstore_auth: {
    //         type: "oauth2",
    //         authorizationUrl: "https://petstore.swagger.io/oauth/authorize",
    //         flow: "implicit",
    //         scopes: {
    //             read_pets: "read your pets",
    //             write_pets: "modify pets in your account"
    //         }
    //     }
    // },
    // definitions: {
    //     Kek: {
    //         kekech: 'gfg'
    //     }
    // }
};

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./index')
})