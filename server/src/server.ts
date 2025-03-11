/**
 * server.ts - Server for the application
 */

/* Importing modules */
import * as http from 'http';
import * as app from './app';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

/* Creating the server */
const server: http.Server = http.createServer(app.default);

/* Connecting to the database */
mongoose
  .connect(process.env.MONGO_DB_URI || 'mongodb://127.0.0.1:27017/test-db')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB', err));

/* Setting up the server */
const port: number = Number(process.env.PORT) || 8001;

/* Starting the server */
server.listen(port, () => {
  console.log(`Quizz game server started on port ${port} at ${new Date()}!`);
});
