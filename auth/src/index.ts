import mongoose from 'mongoose';

import { app } from './app';

const PORT = 4000;

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY not defined');
  }

  try {
    await mongoose.connect('mongodb://auth-mongo-serv:27017/auth', {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to mongodb');

  } catch (error) {
    console.log(error);
  }

  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}

start();
