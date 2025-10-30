const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'API de Gestion de Alumnos',
        description: '',
    },
    host: 'localhost:3000',
    schemes: ['http'],
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['./index.js']; // Cambia este archivo según el punto de entrada de tu API

swaggerAutogen(outputFile, endpointsFiles).then(() => {
    require('./index'); // Inicia el servidor automáticamente
});