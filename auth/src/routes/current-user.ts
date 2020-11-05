import { Router } from 'express';
import { currentUserHandler } from '@bhuone/common';

const router = Router();

router.get('/api/users/currentuser', currentUserHandler, (req, res) => {
  res.send({ currentUser: req.currentUser || null});
});

export { router as currentUserRouter };
