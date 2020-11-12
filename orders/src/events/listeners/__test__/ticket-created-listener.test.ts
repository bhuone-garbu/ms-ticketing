import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { TicketCreatedEvent } from '@bhuone/common';

import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketCreatedListener } from '../ticket-created-listener';

const setup = async () => {
  const listener = new TicketCreatedListener(natsWrapper.client);

  // fake data
  const data: TicketCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'test',
    version: 0,
    price: 15,
    userId: mongoose.Types.ObjectId().toHexString()
  };

  // create a fake message object
  // @ts-ignore
  const message: Message = {
    ack: jest.fn()
  };

  return { listener, data, message };
};

it('creates and saves a ticket, and acks the message', async () => {
  const { listener, data, message } = await setup();

  await listener.onMessage(data, message);

  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual('test');
  expect(ticket!.price).toEqual(15);

  expect(message.ack).toBeCalled();

});
