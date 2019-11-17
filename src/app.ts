import dotenv from 'dotenv';
import express from 'express';
import bodyParser = require('body-parser');
import routes from './routes';
import cors from "./middlerware/cors";
import errorHandler from "./middlerware/cors";
import http from "http";

const app = express();

dotenv.config();

app.use(bodyParser.json());

app.use(cors);

app.use('/api', routes);

app.use(errorHandler);

const server = http.createServer(app);

server.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on port', (server.address() as any).port);
});
