import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();
app.set('trust proxy', true); //express is aware that it's behind a proxy

app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true
}));

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', async () => {
  throw new NotFoundError;
});

app.use(errorHandler);

const PORT = 4000;

const start = async () => {
  try {
    await mongoose.connect('mongodb://auth-mongo-serv:27017/auth', {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to mongodb');

  } catch (err) {
    console.log(err);
  }

  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}

start();
