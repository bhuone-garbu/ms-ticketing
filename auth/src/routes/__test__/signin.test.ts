import request from 'supertest';
import { app } from '../../app';

it('fails when an email is supplied that does not exists', async () => {
  return request(app)
    .post('/api/users/signin')
    .send({
      email: 'doesnotexists@test.com',
      password: 'password',
    })
    .expect(400);
});

it('it fails when an incorrect password is supplied', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  return request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'wrong',
    })
    .expect(400);
});

it('responds with a jwt cookie when signin is successful', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(200);
  
  expect(response.get('Set-Cookie')).toBeDefined();
});
