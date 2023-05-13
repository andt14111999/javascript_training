const fs = require('fs');
const chalk = require('chalk');

const getNotes = () => {
  const notes = loadNotes();
  console.log(chalk.green.inverse.bold('Your notes'));
  notes.forEach((note, idx) => {
    console.log(chalk.italic('## Note: ', idx + 1));
    console.log('- Title: ', note.title);
    console.log('- Body: ', note.body);
  });
};

const readNote = (title) => {
  const notes = loadNotes();
  const note = notes.find((note) => note.title === title);

  if (note) {
    console.log(chalk.green.inverse.bold('Found Note:'));
    console.log('- Body: ', note.body);
  } else {
    console.log(chalk.red.inverse.bold('Note not found'));
  }
};

const addNotes = (title, body) => {
  const notes = loadNotes();
  const duplicateNote = notes.find(
    (note) => note.title === title && note.body === body
  );
  if (!duplicateNote) {
    notes.push({
      title,
      body,
    });

    saveNotes(notes);
    console.log(chalk.green.inverse('New note added!'));
  } else {
    console.log(chalk.red.inverse('Note title taken!'));
  }
};

const removeNote = (title) => {
  const notes = loadNotes();
  const filteredNotes = notes.filter((note) => note.title !== title);

  if (notes.length > filteredNotes.length) {
    console.log(chalk.green.inverse('Noted removed'));
    saveNotes(filteredNotes);
  } else {
    console.log(chalk.red.inverse('No note found!'));
  }
};

const loadNotes = () => {
  try {
    const dataBuffer = fs.readFileSync('notes.json');
    const dataJSON = dataBuffer.toString();

    return JSON.parse(dataJSON);
  } catch (err) {
    return [];
  }
};

const saveNotes = (notes) => {
  const dataJSON = JSON.stringify(notes);
  fs.writeFileSync('notes.json', dataJSON);
};

module.exports = {
  getNotes,
  addNotes,
  removeNote,
  readNote,
};
