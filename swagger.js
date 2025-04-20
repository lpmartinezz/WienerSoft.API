import { Schema } from 'mongoose';
import swaggerAutogen from 'swagger-autogen';

const outputFile = './swagger.json';
const endpointsFiles = ['./src/app.js'];

const api-docs = {
    info: {
        title: 'WienerSoft API',
        description: 'API documentation for WienerSoft',
    },
    host: 'localhost:5000',
    scheme : ['http']
}

swaggerAutogen()(outputFile, endpointsFiles, doc);