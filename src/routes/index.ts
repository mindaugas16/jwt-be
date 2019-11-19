import express from 'express';
import * as AuthController from '../controllers/auth';
import * as InfoController from '../controllers/info';
import AuthMiddleware from '../middleware/auth';

const router = express.Router();

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.get('/info', AuthMiddleware.guard, InfoController.getInfo);

export default router;
