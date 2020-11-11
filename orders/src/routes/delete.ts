import { Router, Request, Response } from 'express';

// import { Ticket } from '../models/ticket';

const router = Router();

router.delete('/api/orders/:id', async (_: Request, res: Response) => {
  res.send([]);
});

export { router as deleteOrderRouter };
