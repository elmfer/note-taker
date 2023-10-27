const fs = require('fs');
const path = require('path');

const DB_DIR = "db"; // Database related stuff goes in the 'db' folder
const DB_FILE = "db.json"; // Database data goes in this file

var _databaseDirectory = null;
var _databaseFilePath = null;

// Schema for setting up the database file for the first time
const SCHEMA = {
  notes: [],
  nextId: 0
}

// Get working directory for the database
function getDatabaseDirectory() {
  if(_databaseDirectory === null)
    _databaseDirectory = DB_DIR;

  return _databaseDirectory;
}

// Get the path location for the database file
function getDatabaseFilePath() {
  if(_databaseFilePath === null)
    _databaseFilePath = path.join(getDatabaseDirectory(), DB_FILE);

  return _databaseFilePath;
}

// Write string content to database file
// Makes paths and files if nessessary
function saveDatabaseData(filename, data) {
  const fileDir = getDatabaseDirectory();

  if(!fs.existsSync(fileDir))
    fs.mkdirSync(fileDir);

  const filePath = getDatabaseFilePath();

  fs.writeFileSync(filePath, data);
}

// Read string content to database file
// Makes paths and files if nessessary
function getDatabaseData(filename) {
  const fileDir = getDatabaseDirectory();

  if(!fs.existsSync(fileDir))
    fs.mkdirSync(fileDir);

  const filePath = getDatabaseFilePath();

  // Create initial database file from schema
  if(!fs.existsSync(filePath))
    saveDatabaseData(DB_FILE, JSON.stringify(SCHEMA, null, 4));

  return fs.readFileSync(filePath);
}

// Note Database API
const NoteDatabase = {
  // Get the list of notes from database
  getNotes: function() {
    const dbContents = getDatabaseData(DB_FILE);

    const db = JSON.parse(dbContents);

    return db.notes;
  },

  // Save a note to the database
  saveNote: function(note) {
    let dbContents = getDatabaseData(DB_FILE);

    const db = JSON.parse(dbContents);

    note.id = db.nextId++;
    db.notes.push(note);

    dbContents = JSON.stringify(db, null, 4);

    saveDatabaseData(DB_FILE, dbContents);
  },
  // Remove a note from the database using its id
  removeNote: function(id) {
    let dbContents = getDatabaseData(DB_FILE);

    const db = JSON.parse(dbContents);

    // Filter all notes with the given id
    let found = false;
    db.notes = db.notes.filter((note) => {
      if(note.id == id) {
        found = true;
        return false;
      }
      return true;
    });

    // Had found selected note and had successfully deleted it
    if(found) {
      dbContents = JSON.stringify(db, null, 4);
      saveDatabaseData(DB_FILE, dbContents);
      return true;
    }

    return false;
  }
};

module.exports = NoteDatabase;