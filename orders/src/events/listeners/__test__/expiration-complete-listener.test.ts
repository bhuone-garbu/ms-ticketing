import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { ExpirationCompleteEvent, OrderStatus } from '@bhuone/common';

import { Ticket } from '../../../models/ticket';
import { Order } from '../../../models/order';
import { natsWrapper } from '../../../nats-wrapper';
import { ExpirationCompleteListener } from '../expiration-complete-listener';

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = await Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'test',
    price: 20,
  });
  await ticket.save();

  const order = await Order.build({
    status: OrderStatus.Created,
    expiresAt: new Date(),
    userId: '134',
    ticket,
  });
  await order.save();

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id
  };

  // @ts-ignore
  const message: Message = {
    ack: jest.fn()
  };

  return { listener, message, data, order };
};

it('updates the order status to cancelled', async () => {
  const { listener, message, data, order } = await setup();

  await listener.onMessage(data, message);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits an OrderCancelled event and acks the message', async () => {
  const { listener, message, data, order } = await setup();

  await listener.onMessage(data, message);

  const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
  expect(eventData.id).toEqual(order.id);
  expect(message.ack).toHaveBeenCalled();
});
