
const fs = require('fs');
const path = require('path');
const fsPromises = require('fs').promises;
const source = path.join(__dirname, 'files-copy');
const files = './04-copy-directory/files/';

fs.mkdir(source, { recursive: true }, err => {
    console.log(`The folder  ${source} was created`);
    fs.readdir(files, (err, files) => {
        files.forEach(file => {
            let first = path.join(__dirname, 'files', file);
            let second = path.join(__dirname, 'files-copy', file);
            fs.copyFile(first, second, err => {
                if (err) throw err;
                console.log(`File  ${file} was copied`);
            });
        });
    });
});