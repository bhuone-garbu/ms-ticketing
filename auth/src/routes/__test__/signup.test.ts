import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);
});

it('returns a 400 with an invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test',
      password: 'password',
    })
    .expect(400);
});

it('returns a 400 with an invalid password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test',
      password: '1',
    })
    .expect(400);
});

it('returns a 400 with missing email and password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test2@test.com'
    })
    .expect(400);

  return request(app)
    .post('/api/users/signup')
    .send({
      password: '6789sfsfsf'
    })
    .expect(400);
});

it('it does not allow duplicate emails in sign up', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'unique@test.com',
      password: 'password'
    })
    .expect(201);

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'unique@test.com',
      password: 'password'
    })
    .expect(400);
});

it('sets a cookie header after successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'unique@test.com',
      password: 'password'
    })
    .expect(201);
  
  expect(response.get('Set-Cookie')).toBeDefined();
});
