const fs = require('fs');
const path = require('path');
const readline = require('readline');

const text = path.join(__dirname, '/text.txt');
const writableStream = fs.createWriteStream(text);


process.stdout.write('Please enter text here: \n');

process.stdin.on('data', (part) => {
    writableStream.write(part.toString('utf-8'));
    if (part.toString('utf-8').trim() === 'exit') {
      process.stdout.write('Good buy!\n');
      process.exit();
    }
  });

  process.on('SIGINT', () => {
    process.stdout.write('Good buy!\n');
    process.exit();
  });