import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUserHandler } from '@bhuone/common';

import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { allTicketRouter } from './routes/all';
import { saveTicketRouter } from './routes/save';

const app = express();
app.set('trust proxy', true); //express is aware that it's behind a proxy

app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  }));

app.use(currentUserHandler);

app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(allTicketRouter);
app.use(saveTicketRouter);

app.all('*', async () => {
  throw new NotFoundError;
});

app.use(errorHandler);

export { app };
