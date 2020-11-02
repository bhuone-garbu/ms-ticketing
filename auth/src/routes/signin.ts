import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { User } from '../models/user'
import { validateRequest } from '../middlewares/validated-request';
import { BadRequestError } from '../errors/bad-request-error';
import { PasswordManager } from '../services/password-manager';

const router = Router();

router.post('/api/users/signin',
  [
    body('email')
      .isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    const passwordMatch = await PasswordManager.compare(existingUser.password, password);
    if (!passwordMatch) {
      throw new BadRequestError('Invalid credentials');
    }

    // generate jwt
    const userJWT = jwt.sign({
      id: existingUser.id,
      email: existingUser.email
    }, process.env.JWT_KEY!);

    // store on the session object
    req.session = {
      jwt: userJWT
    };

    res.status(200).send(existingUser);
  });

export { router as signinRouter };
