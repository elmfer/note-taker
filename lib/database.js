const fs = require('fs');
const path = require('path');

const DB_DIR = "db";
const DB_FILE = "db.json";

var _databaseDirectory = null;
var _databaseFilePath = null;

const SCHEMA = {
  notes: [],
  nextId: 0
}

function getDatabaseDirectory() {
  if(_databaseDirectory === null)
    _databaseDirectory = DB_DIR;

  return _databaseDirectory;
}

function getDatabaseFilePath() {
  if(_databaseFilePath === null)
    _databaseFilePath = path.join(getDatabaseDirectory(), DB_FILE);

  return _databaseFilePath;
}

function saveDatabaseData(filename, data) {
  const fileDir = getDatabaseDirectory();

  if(!fs.existsSync(fileDir))
    fs.mkdirSync(fileDir);

  const filePath = getDatabaseFilePath();

  fs.writeFileSync(filePath, data);
}

function getDatabaseData(filename) {
  const fileDir = getDatabaseDirectory();

  if(!fs.existsSync(fileDir))
    fs.mkdirSync(fileDir);

  const filePath = getDatabaseFilePath();

  if(!fs.existsSync(filePath))
    saveDatabaseData(DB_FILE, JSON.stringify(SCHEMA, null, 4));
    

  return fs.readFileSync(filePath);
}

const NoteDatabase = {
  getNotes: function() {
    const dbContents = getDatabaseData(DB_FILE);

    const db = JSON.parse(dbContents);

    return db.notes;
  },

  saveNote: function(note) {
    let dbContents = getDatabaseData(DB_FILE);

    const db = JSON.parse(dbContents);

    note.id = db.nextId++;
    db.notes.push(note);

    dbContents = JSON.stringify(db, null, 4);

    saveDatabaseData(DB_FILE, dbContents);
  },

  removeNote: function(id) {
    let dbContents = getDatabaseData(DB_FILE);

    const db = JSON.parse(dbContents);

    let found = false;
    db.notes = db.notes.filter((note) => {
      if(note.id == id) {
        found = true;
        return false;
      }

      return true;
    });

    if(found) {
      dbContents = JSON.stringify(db, null, 4);
      saveDatabaseData(DB_FILE, dbContents);
      return true;
    }

    return false;
  }
};

module.exports = NoteDatabase;