const fs = require('fs');
const path = require('path');

const pathFolder = path.join(__dirname, 'secret-folder');


 fs.readdir(pathFolder,{ withFileTypes: true },  (err, files) => {
    if (err) throw err;
    for (const item of files) {
      if (item.isFile()) {
        const file = path.join(pathFolder, item.name);
        fs.stat(file, (err, fileSize) => {
          if (err) throw err;
          console.log(`${path.parse(file).name} - ${path.extname(file)} - ${ fileSize.size / 1000 }kb`);
        });
      }
    }
  });