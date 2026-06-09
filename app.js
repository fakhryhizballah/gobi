require('dotenv').config();
const express = require('express');
const routes = require('./routes/index');

const app = express();

app.use(express.json());
app.use('/api/gobi', routes);

app.get('/', (req, res) => {
  res.json({ message: 'REST API is running' });
});

module.exports = app;
