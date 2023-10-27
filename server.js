const express = require('express');
const path = require('path');
const api = require('./lib/app');

const PORT = process.env.PORT ? process.env.PORT : 3001;

// Create express app
const app = express();

// Serve static file from the public directory
app.use(express.static("public"));

// Any api calls are sent to the API route
app.use('/api', api);

// Serve the note html file on the /notes route
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

// Start listening on designated port
app.listen(PORT, () => {
  console.log(`Server now hosted on port ${PORT}.`);
  console.log(`If served locally, access it here: http://localhost:${PORT}`);
});