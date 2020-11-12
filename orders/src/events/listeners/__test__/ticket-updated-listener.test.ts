import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { TicketUpdatedEvent } from '@bhuone/common';

import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketUpdatedListener } from '../ticket-updated-listener';

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'test',
    price: 20,
  });

  await ticket.save();

  // fake data
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    title: 'new test',
    version: ticket.version + 1,
    price: 10,
    userId: mongoose.Types.ObjectId().toHexString()
  };

  // create a fake message object
  // @ts-ignore
  const message: Message = {
    ack: jest.fn()
  };

  return { listener, data, message, ticket };
};

it('finds, updates and saves a ticket, and acks the message', async () => {
  const { listener, data, message } = await setup();

  await listener.onMessage(data, message);

  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
  expect(ticket!.version).toEqual(data.version);

  expect(message.ack).toBeCalled();
});

it('message ack is not called if event has skipped a version', async () => {
  const { listener, data, message, ticket } = await setup();

  // faking a skipped version
  data.version = 10;

  try {
    await Ticket.findById(data.id);
  } catch (error) { }

  expect(message.ack).not.toBeCalled();
});
