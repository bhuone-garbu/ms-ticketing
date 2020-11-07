import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUserHandler } from '@bhuone/common';

import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';

const app = express();
app.set('trust proxy', true); //express is aware that it's behind a proxy

app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}));

app.use(currentUserHandler);

app.use(createTicketRouter);
app.use(showTicketRouter);

app.all('*', async () => {
  throw new NotFoundError;
});

app.use(errorHandler);

export { app };