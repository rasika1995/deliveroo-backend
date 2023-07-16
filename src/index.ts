import express from 'express';
import sequelize from './db-config/mysql';
import router from './routes';

const app = express();
const port = 8080;
// Middleware to parse request body as JSON
app.use(express.json());

// Register the routes
app.use('/', router);

// Test endpoint for checking MySQL connection
app.get('/test-connection', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.send('MySQL connection successful');
  } catch (error) {
    console.error('Error connecting to MySQL:', error);
    res.status(500).send('MySQL connection failed');
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
