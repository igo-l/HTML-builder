const fs = require('fs');
const path = require('path');
const directoryFirst = path.join(__dirname, "styles");
const directorySecond = path.join(__dirname, "project-dist");
const filesCopyPath = path.join(directorySecond, "bundle.css");
fs.readdir(directoryFirst, { withFileTypes: true }, function (err, files) {
    fs.writeFile(filesCopyPath, "", function(err) {
        if(err) {
            return console.log(err);
        }
        files.forEach(function (file) {
            if (file.isFile() && path.extname(file.name) == ".css") {
                let path = directoryFirst + "/" + file.name;
                fs.readFile(path, 'utf8' , (err, data) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    fs.appendFile(filesCopyPath, data, function (err) {
                        if (err) throw err;
                        console.log('Styles merged');
                    });
                })
            }
        })
    });
});
