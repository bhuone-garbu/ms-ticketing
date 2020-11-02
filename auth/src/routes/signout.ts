import { Router } from 'express';
import cookieSession from 'cookie-session';

const router = Router();

router.post('/api/users/signout', (req, res) => {
  req.session = null;
  res.send({});
});

export { router as signoutRouter };
