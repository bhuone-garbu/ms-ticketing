import request from 'supertest';

import { app } from '../../app';

const createTestTicket = () => {
  return request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'some title',
      price: 20,
    })
}

it('fetches a list of tickets', async () => {
  await createTestTicket();
  await createTestTicket()
  
  const response = await request(app)
    .get('/api/tickets')
    .send()
    .expect(200);

  expect(response.body.length).toEqual(2);
});
