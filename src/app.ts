import dotenv from 'dotenv';
import express from 'express';
import bodyParser = require('body-parser');
import routes from './routes';
import cors from './middleware/cors';
import errorHandler from './middleware/error-handler';
import http from 'http';
import mongoose from 'mongoose';
import AuthMiddleware from './middleware/auth';

const app = express();

dotenv.config();

app.use(bodyParser.json());

app.use(AuthMiddleware.setAuth);
app.use(cors);

app.use('/api', routes);

app.use(errorHandler);

mongoose
    .connect(
        `mongodb://${process.env.MONGO_URL}:${process.env.MONGO_DB}/${process.env.MONGO_DB}`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    )
    .then(() => {
        const server = http.createServer(app);

        server.listen(process.env.PORT || 3000, () => {
            console.log('Server is running on port', (server.address() as any).port);
        });
    })
    .catch(error => {
        throw error;
    });
