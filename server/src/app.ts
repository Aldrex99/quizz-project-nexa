/**
 * app.ts - Application for the server
 */

/* Importing modules */
import express, { Application } from 'express';
import applyMiddlewares from './middlewares/index';
import { checkAccessToken } from './middlewares/token';
import { errorHandler } from './middlewares/errorHandler';
import { CustomError } from './utils/customError';

import authRouter from './routes/auth';
import userRouter from './routes/user';
import categoryRouter from './routes/category';
import quizzRouter from './routes/quizz';
import answerRouter from './routes/answer';

/* Creating the application */
const app: Application = express();

/* Setting up the middleware */
applyMiddlewares(app);

/* Setting up the API routes */
app.use('/api/auth', authRouter);
app.use('/api/user', checkAccessToken, userRouter);
app.use('/api/category', checkAccessToken, categoryRouter);
app.use('/api/quizz', checkAccessToken, quizzRouter);
app.use('/api/answer', checkAccessToken, answerRouter);

app.use('/api/*', (req, res) => {
  throw new CustomError('Route not found', 404, 'NOT_FOUND', true, null);
});

app.use(errorHandler);

/* Route for public files */
app.use('/public', express.static('public'));

app.use((req, res) => {
  res.status(404).send('Route not found');
});

/* Exporting the application */
export default app;
