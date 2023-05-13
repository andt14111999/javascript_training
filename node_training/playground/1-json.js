const fs = require('fs');
// const book = { title: 'Ego is the Enemy', author: 'Ryan Holiday' };

// const bookJSON = JSON.stringify(book);
// fs.writeFileSync('1-json.json', bookJSON);

// const dataBuffer = fs.readFileSync('1-json.json');
// const dataJSON = dataBuffer.toString();

// const data = JSON.parse(dataJSON);
// console.log(data.title);

const authorBuffer = fs.readFileSync('1-json.json');
const authorJSON = authorBuffer.toString();

const author = JSON.parse(authorJSON);
author.age = 200;
author.name = 'An';
fs.writeFileSync('1-json.json', JSON.stringify(author));
