import mongoose from 'mongoose';

import { app } from './app';

const PORT = 4000;

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY not defined');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI not defined');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
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
