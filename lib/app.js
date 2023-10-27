const express = require('express');
const NoteDatabase = require('./database');

// Create express app
const app = express();

// Use middleware to aid in parsing client request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Return notes from the database
app.get('/notes', (req, res) => {
  res.json(NoteDatabase.getNotes());
});

// Adds a note to the database
app.post('/notes', (req, res) => {
  const note = req.body;

  // Ensure it's request is valid, return error 400 otherwise
  if(!note.title || !note.text) {
    res.status(400).send("Invalid note format");
    return;
  }

  NoteDatabase.saveNote(note);

  res.status(201).send("Saved note");
});

// Delete a note from the database with a given id
app.delete('/notes/:noteId', (req, res) => {
  const removeWasSuccessful =  NoteDatabase.removeNote(req.params.noteId);

  if(!removeWasSuccessful) {
    res.status(404).send(`No note with id of ${req.params.noteId} exists`);
    return;
  }

  res.send("Deleted note");
});

module.exports = app;