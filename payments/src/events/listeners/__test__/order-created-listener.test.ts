import { OrderCreatedEvent, OrderStatus } from '@bhuone/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Order } from '../../../models/order';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCreatedListener } from '../order-created-listener';

const setup = async () => {

  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    expiresAt: new Date().toISOString(),
    status: OrderStatus.Created,
    userId: '2313',
    ticket: {
      id: '123',
      price: 20
    }
  };

  // @ts-ignore
  const message: Message = {
    ack: jest.fn()
  };

  return { message, data, listener };
};

it('should replicate the order info and ack the message', async () => {
  const { message, data, listener } = await setup();

  await listener.onMessage(data, message);

  const order = await Order.findById(data.id);
  expect(order!.price).toEqual(data.ticket.price);

  expect(message.ack).toHaveBeenCalled();
});


