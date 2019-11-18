import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import isEmail = require('validator/lib/isEmail');

const tokenExpiresIn = 3; // hours

const generateJWT = user =>
  jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET_KEY,
    { expiresIn: `${ tokenExpiresIn }h` }
  );

export default {
  login: (req, res, next) => {
    const { email, password } = req.body;

    if (req.isAuth || !isEmail(email)) {
      const error = new Error('Invalid input') as any;
      error.statusCode = 422;

      return next(error);
    }

    User.findOne({ email })
      .then(user => {
        if (!user) {
          const error = new Error('Invalid input') as any;
          error.statusCode = 422;

          return next(error);
        }

        bcrypt.compare(password, user.password)
          .then((doesMatch: boolean) => {
            if (doesMatch) {
              return res
                .status(200)
                .send({
                  userId: user.id,
                  token: generateJWT(user),
                  tokenExpiration: tokenExpiresIn
                })
            }

            const error = new Error('Invalid input') as any;
            error.statusCode = 422;

            return next(error);
          })
      })
      .catch(err => next(err))
  },
  register: (req, res, next) => {
    const { email, password } = req.body;

    const errors: { field: string; type: string; message: string }[] = [];

    if (!isEmail(email)) {
      errors.push({
        field: 'email',
        type: 'invalidEmail',
        message: 'Invalid email'
      });
    }

    if (errors.length) {
      const error = new Error('Invalid input') as any;
      error.data = errors;
      error.statusCode = 422;

      return next(error);
    }

    User.findOne({ email })
      .then(user => {
        if (user) {
          const error = new Error('User already exist') as any;
          error.statusCode = 422;

          return next(error);
        }

        return bcrypt.hash(password, 12);
      })
      .then(hashedPassword => {
        const { password, ...rest } = req.body;

        return new User({
          ...rest,
          password: hashedPassword
        }).save()
      })
      .then(result => {
        res.json({
          ...result._doc,
          _id: result.id
        })
      })
      .catch(err => {
        next(err);
      })
  }
}
