import express from 'express';
import { json } from 'body-parser';

const app = express();
app.use(json());

const PORT = 4000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}!!!`));
