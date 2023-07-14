import express from 'express';

const app = express();
const port = 80;

app.get('/', (req, res) => {
  res.send('Hello, Deliveroo-backend!');
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});