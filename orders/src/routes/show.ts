import { Router, Request, Response } from 'express';
import { NotFoundError } from '@bhuone/common';

// import { Ticket } from '../models/ticket';

const router = Router();

router.get('/api/orders/:id', async (req: Request, res: Response) => {
  // const ticket = await Ticket.findById(req.params.id);

  // if (!ticket) throw new NotFoundError();

  res.send({});
});

router.get('/api/orders', async (_: Request, res: Response) => {
  // const tickets = await Ticket.find({});
  res.send([]);
});

export { router as showOrdersRouter };
