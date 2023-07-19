import express from 'express';
import { authRouter, publicRouter } from './routes';
import dotenv from 'dotenv';
import cors from 'cors';
import authenticationMiddleware from './middleware/auth-middleware';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT;

// Middleware to parse request body as JSON
app.use(express.json());
app.use(cors());

// Use the publicRouter for the routes that do not require authentication
app.use(publicRouter);

app.use(authenticationMiddleware)

// Use the authRouter for the routes that require authentication
app.use(authRouter);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
