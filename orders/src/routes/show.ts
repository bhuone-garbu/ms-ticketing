import { Router, Request, Response } from 'express';
import { requireAuth, NotFoundError, NotAuthorized } from '@bhuone/common';

import { Order } from '../models/order';

const router = Router();

router.get('/api/orders/:id', requireAuth, async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id)
    .populate('ticket');

  if (!order) throw new NotFoundError();
  if (order.userId !== req.currentUser!.id) throw new NotAuthorized();

  res.send(order);
});

router.get('/api/orders', requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.currentUser!.id
  }).populate('ticket');

  res.send(orders);
});

export { router as showOrdersRouter };
