const express = require('express');
const bodyParser = require('body-parser');

const loginService = require('./services/loginService');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.use('/api', loginService);

app.listen(PORT, () => {
  console.log('Node.js server running at http://localhost:${PORT}');
});
