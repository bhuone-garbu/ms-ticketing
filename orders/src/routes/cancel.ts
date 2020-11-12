import { Router, Request, Response } from 'express';
import { requireAuth, NotFoundError, NotAuthorized } from '@bhuone/common';

import { Order, OrderStatus } from '../models/order';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = Router();

router.patch('/api/orders/:id', requireAuth, async (req: Request, res: Response) => {

  const order = await Order.findById(req.params.id).populate('ticket');

  if (!order) throw new NotFoundError();

  if (order.userId !== req.currentUser!.id) throw new NotAuthorized();

  order.status = OrderStatus.Cancelled;
  await order.save();

  await new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
    ticket: {
      id: order.ticket.id
    }
  });

  res.send(order);
});


export { router as cancelOrderRouter };
