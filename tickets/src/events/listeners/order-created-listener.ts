import { Listener, OrderCreatedEvent, Subjects } from '@bhuone/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { TickerUpdatedPublisher } from '../publishers/ticket-updated-publisher';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) throw new Error('Cannot find the ticket');

    ticket.set({ orderId: data.id });

    await ticket.save();
    await new TickerUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.version,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
    });

    msg.ack();
  }
}
