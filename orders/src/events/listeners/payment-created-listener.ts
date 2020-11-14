import { Listener, OrderStatus, PaymentCreatedEvent, Subjects } from '@bhuone/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { queueGroupName } from './queue-group-name';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent['data'], message: Message) {
    const order = await Order.findById(data.id);

    if (!order) throw new Error('Order not found');

    order.set({ status: OrderStatus.Complete });

    await order.save();

    message.ack();
  }
}
