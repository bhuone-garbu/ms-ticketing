import request from 'supertest';

import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';
// import { natsWrapper } from '../../nats-wrapper';


it('cancels an order', async () => {
  const ticket = Ticket.build({
    title: 'test',
    price: 20,
  });

  await ticket.save();

  const user = global.signin();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .patch(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  const cancelledOrder = await Order.findById(order.id);
  expect(cancelledOrder?.status).toEqual(OrderStatus.Cancelled);
});
