import mongoose from 'mongoose';
import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { NotFoundError, BadRequestError,
  OrderStatus, requireAuth, validateRequest } from '@bhuone/common';

import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
// import { TickerCreatedPublisher } from '../events/publishers/ticket-created-publisher';
// import { natsWrapper } from '../nats-wrapper';

const router = Router();

router.post('/api/orders', requireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('ticketId is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    const { ticketId } = req.body;
    
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw new NotFoundError();

    const isReserved = await ticket.isReserved();
    if (isReserved) throw new BadRequestError('Ticket is already reseved');

    res.status(201).send({});
  });

export { router as createOrderRouter };
