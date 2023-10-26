const express = require('express');
const NoteDatabase = require('./database');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/notes', (req, res) => {
  res.json(NoteDatabase.getNotes());
});

app.post('/notes', (req, res) => {
  const note = req.body;

  NoteDatabase.saveNote(note);

  res.status(201).send("Saved note");
});

app.delete('/notes/:noteId', (req, res) => {
  const removeWasSuccessful =  NoteDatabase.removeNote(req.params.noteId);

  if(!removeWasSuccessful) {
    res.status(404).send(`No note with id of ${req.params.noteId} exists`);
    return;
  }

  res.send("Deleted note");
});

module.exports = app;