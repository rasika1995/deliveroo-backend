import express from 'express';
import router from './routes';
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT;

// Middleware to parse request body as JSON
app.use(express.json());
app.use(cors());

// Register the routes
app.use('/', router);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
