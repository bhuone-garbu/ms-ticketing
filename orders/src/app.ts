import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUserHandler } from '@bhuone/common';

import { createOrderRouter } from './routes/new';
import { showOrdersRouter } from './routes/show';
import { cancelOrderRouter } from './routes/cancel';

const app = express();
app.set('trust proxy', true); //express is aware that it's behind a proxy

app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}));

app.use(currentUserHandler);

app.use(createOrderRouter);
app.use(showOrdersRouter);
app.use(cancelOrderRouter);


app.all('*', async () => {
  throw new NotFoundError;
});

app.use(errorHandler);

export { app };
