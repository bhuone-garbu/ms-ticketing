import { Router } from 'express';
import jwt from 'jsonwebtoken';

import { currentUserHandler } from '../middlewares/current-user-handler'

const router = Router();

router.get('/api/users/currentuser', currentUserHandler, (req, res) => {
  res.send({ currentUser: req.currentUser || null})
});

export { router as currentUserRouter };
