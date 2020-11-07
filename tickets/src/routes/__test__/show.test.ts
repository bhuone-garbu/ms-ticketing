import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';

it('returns a 404 if the ticket is not found', async () => {
  const testId = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .get(`/api/tickets/${testId}`)
    .send()
    .expect(404);
});

it('returns the ticket if the ticket is found', async () => {

  const title = 'some title';
  const price = 40;

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price
    })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'some title',
      price: 40
    })
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});
