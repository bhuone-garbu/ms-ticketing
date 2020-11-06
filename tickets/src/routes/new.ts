import { Router, Request, Response } from 'express';
import { requireAuth } from '@bhuone/common';

const router = Router();

router.post('/api/tickets', requireAuth, (req: Request, res: Response) => {
  res.sendStatus(200);
});

export { router as createTicketRouter };
