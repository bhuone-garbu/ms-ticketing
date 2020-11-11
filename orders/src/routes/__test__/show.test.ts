import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';
// import { natsWrapper } from '../../nats-wrapper';

const buildTestTicket = async () => {
  const ticket = Ticket.build({
    title: 'test',
    price: 20,
  });

  await ticket.save();
  return ticket;
}

it('fetches all orders for an particular user', async () => {
  const ticket1 = await buildTestTicket();
  const ticket2 = await buildTestTicket();
  const ticket3 = await buildTestTicket();

  // pretend - different users
  const userOne = global.signin();
  const userTwo = global.signin();

  const { body: userOneOrderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticket1.id })
    .expect(201);

  // usertwo - has different tickets, ticket2 and ticket3
  const { body: userTwoOrderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticket2.id })
    .expect(201);
  const { body: userTwoOrderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticket3.id })
    .expect(201);

  const { body: userOneResponse } = await request(app)
    .get('/api/orders')
    .set('Cookie', userOne)
    .expect(200);

  const { body: userTwoResponse } = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .expect(200);

  // ensure the body is correct precisely
  expect(userOneResponse.length).toEqual(1);
  expect(userOneResponse[0].id).toEqual(userOneOrderOne.id);
  expect(userOneResponse[0].ticket.id).toEqual(ticket1.id);

  expect(userTwoResponse.length).toEqual(2);
  expect(userTwoResponse[0].id).toEqual(userTwoOrderOne.id);
  expect(userTwoResponse[0].ticket.id).toEqual(ticket2.id);
  expect(userTwoResponse[1].id).toEqual(userTwoOrderTwo.id);
  expect(userTwoResponse[1].ticket.id).toEqual(ticket3.id);
});

it('fetch the order', async () => {
  const ticket = await buildTestTicket();

  // pretend - different users
  const user = global.signin();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  const { body: fetchOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(fetchOrder.id).toEqual(order.id);
});

it('returns an error if it tried to fetch someone else order', async () => {
  const ticket = await buildTestTicket();

  // pretend - different users
  const user = global.signin();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  const { body: fetchOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(401);
});
