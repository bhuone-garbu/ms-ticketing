import { Router, Request, Response } from 'express';
import { requireAuth, NotFoundError } from '@bhuone/common';

import { Order } from '../models/order';

const router = Router();

router.get('/api/orders/:id', async (req: Request, res: Response) => {
  // const ticket = await Ticket.findById(req.params.id);

  // if (!ticket) throw new NotFoundError();

  res.send({});
});

router.get('/api/orders', requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.currentUser!.id
  }).populate('ticket');

  res.send(orders);
});

export { router as showOrdersRouter };
