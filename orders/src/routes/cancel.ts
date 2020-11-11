import { Router, Request, Response } from 'express';
import { requireAuth, NotFoundError, NotAuthorized } from '@bhuone/common';

import { Order, OrderStatus } from '../models/order';

const router = Router();

router.patch('/api/orders/:id', requireAuth, async (req: Request, res: Response) => {

  const order = await Order.findById(req.params.id).populate('ticket');

  if (!order) throw new NotFoundError();

  if (order.userId !== req.currentUser!.id) throw new NotAuthorized();

  order.status = OrderStatus.Cancelled;
  await order.save()

  // Not content from the client prospective
  res.send(order);
});


export { router as cancelOrderRouter };
