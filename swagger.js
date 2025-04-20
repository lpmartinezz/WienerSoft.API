import { Schema } from 'mongoose';
import swaggerAutogen from 'swagger-autogen';

const outputFile = './swagger.json';
const endpointsFiles = ['./src/app.js'];

const doc = {
    info: {
        title: 'WienerSoft API',
        description: 'API documentation for WienerSoft',
    },
    host: 'wienersoft-api.onrender.com',
    scheme : ['https'],
}

swaggerAutogen()(outputFile, endpointsFiles, doc);