import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { UserInterface } from '../models/user';
import isEmail = require('validator/lib/isEmail');
import { Request, Response, NextFunction } from 'express';

const tokenExpiresIn = 3; // hours

interface RegistrationError {
    field: string;
    type: string;
    message: string;
}

class StatusError extends Error {
    statusCode: number;
    data?: any;

    constructor(message: string, statusCode: number, data?: any) {
        super(message);
        this.statusCode = statusCode;
        this.data = data;
    }
}

const generateJWT = (user: UserInterface) =>
    jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: `${tokenExpiresIn}h` }
    );

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body as UserInterface;

    if ((req as any).isAuth) {
        return next(new StatusError('Authentication required', 401));
    }

    if (!isEmail(email)) {
        return next(new StatusError('Invalid email', 400));
    }

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return next(new StatusError('Wrong user or password', 400));
    }

    return res.send({ token: generateJWT(user) });
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body as UserInterface;

    const errors: RegistrationError[] = [];

    if (!isEmail(email)) {
        errors.push({
            field: 'email',
            type: 'invalidEmail',
            message: 'Invalid email'
        });
    }

    if (errors.length) {
        return next(new StatusError('Invalid input', 400, errors));
    }

    const user = await User.findOne({ email });

    if (user) {
        return next(new StatusError('User already exists', 400));
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const savedUser = await new User({
        ...req.body,
        password: hashedPassword
    }).save();

    res.json({ _id: savedUser.id });
};
