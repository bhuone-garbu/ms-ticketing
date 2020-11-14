import { OrderCancelledEvent, OrderStatus } from '@bhuone/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Order } from '../../../models/order';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCancelledListener } from '../order-cancelled-listener';

const setup = async () => {

  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    version: 0,
    price: 20,
    userId: '123'
  });

  await order.save();

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: '123'
    }
  };

  // @ts-ignore
  const message: Message = {
    ack: jest.fn()
  };

  return { message, data, listener };
};

it('should cancel the order info and ack the message', async () => {
  const { message, data, listener } = await setup();

  await listener.onMessage(data, message);

  const order = await Order.findById(data.id);
  expect(order!.status).toEqual(OrderStatus.Cancelled);

  expect(message.ack).toHaveBeenCalled();
});


