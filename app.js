require('dotenv').config();
const express = require('express');
const routes = require('./routes/index');
const { createClient } = require('redis');

const app = express();

app.use(express.json());

const client = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_URL,
    port: process.env.REDIS_URL_PORT
  }
});
client.connect();
client.on('connect', () => {
  console.log('Redis client connected');
});
client.on('error', (err) => {
  console.log('Something went wrong ' + err);
});

app.use((req, res, next) => {
  req.cache = client;
  next();
});

app.use('/api/gobi', routes);
app.use('/api/gobi/static', express.static('public'));
app.get('/', (req, res) => {
  res.json({ message: 'REST API is running' });
});
app.use((err, req, res, next) => {
  if (err) {
    return res.status(400).json({
      status: false,
      message: err.message
    });
  }
  next();
});

module.exports = app;
