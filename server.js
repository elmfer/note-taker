const express = require('express');
const path = require('path');
const api = require('./lib/app');

const PORT = process.env.PORT ? process.env.PORT : 3001;

const app = express();

app.use(express.static("public"));
app.use('/api', api);

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.listen(PORT, () => {
  console.log(`Server now hosted on port ${PORT}.`);
  console.log(`If served locally, access it here: http://localhost:${PORT}`);
});