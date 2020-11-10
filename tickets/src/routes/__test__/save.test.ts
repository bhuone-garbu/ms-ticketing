import request from 'supertest';
import mongoose from 'mongoose';

import { natsWrapper } from '../../nats-wrapper';
import { app } from '../../app';

it('returns a 404 if the provided id does not exists', async () => {
  const testId = mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${testId}`)
    .set('Cookie', global.signin())
    .send({
      title: 'test',
      price: '123'
    })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const testId = mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${testId}`)
    .send({})
    .expect(401);
});

it('returns a 401 if the uer does not own the ticket', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'test',
      price: 123
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'test',
      price: 140
    })
    .expect(401);
});

it('returns a 400 if the users provides an invalid title or price', async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'test',
      price: 123
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 123
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'valid title',
      price: -10
    })
    .expect(400);
});

it('updates the ticket if input request is valid', async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'test',
      price: 123
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 321
    })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send({})
    .expect(200);

  expect(ticketResponse.body.title).toEqual('new title');
  expect(ticketResponse.body.price).toEqual(321);
});

it('pubishes an event when ticket is updated', async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'some title',
      price: 20,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 321
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);
});
