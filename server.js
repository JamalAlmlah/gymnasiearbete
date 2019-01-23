
const express = require('express');
const app = express ();
app.get('/', (request, response) => {
  response.send('Hello world');
});
app.listen(1111, () => console.log('Application running on port 1111'));