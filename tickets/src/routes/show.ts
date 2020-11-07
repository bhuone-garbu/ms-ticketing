import { Router, Request, Response } from 'express';
import { NotFoundError } from '@bhuone/common';

import { Ticket } from '../models/ticket';

const router = Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) throw new NotFoundError();

  res.send(ticket);
});

router.get('/api/tickets', async (_: Request, res: Response) => {
  const tickets = await Ticket.find({});
  res.send(tickets);
});

export { router as showTicketRouter };
