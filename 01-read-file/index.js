const path = require('path');
const fs = require('fs');
const filePath = path.join(__dirname, 'text.txt');
const stream = fs.ReadStream(filePath, 'utf-8');
stream.on('readable', function(){
while ( data = stream.read()){
    console.log(data);
}
});

