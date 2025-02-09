const fs = require('fs');
const path = require('path');
const mFolderPath = path.join(__dirname, 'project-dist');
const tPath = path.join(__dirname, 'template.html');
const cPath = path.join(__dirname, 'components');
const indexHTMLPath = path.join(__dirname, 'project-dist' , 'index.html');
const stCssPath = path.join(__dirname, 'project-dist/style.css');
const fPathStyle = path.join(__dirname, 'styles');
const filePathF = path.join(__dirname, 'assets');
const filePathSec = path.join(__dirname, 'project-dist/assets');

async function start(folder) {
  await fs.access(folder, fs.F_OK, (err) => {
    if (err) {
      fs.mkdir(folder, (err) => {
        if (err) {
          throw err;
        }
        console.log(`Create folder: ${path.basename(folder)}.`);
      })
    }
  })
}

async function changeTemplate() {
  const stream = fs.createReadStream(tPath, 'utf-8');
  const indexHtml = fs.createWriteStream(indexHTMLPath);
  let html = '';
  stream.on('data', chunk => {
    html += chunk;
    html = html.toString();
    fs.readdir(cPath, {withFileTypes: true}, (err, components) => {
      if (err) {
        throw err;
      }
      let array = [];
      for (let file of components) {
        array.push(`{{${path.parse(file.name).name}}}`)
      }
   fs.promises.readdir(cPath)
      .then(components => {
        components.forEach((file, index) => {
          const componentPath = path.join(__dirname, 'components', file);
          const readableStream = fs.createReadStream(componentPath);
          readableStream.on('data', chunk => {
            html = html.replace(array[index], chunk);
            if (index === array.length - 1) {
             indexHtml.write(html);
            }
            console.log(`Template: ${path.parse(componentPath).name} /  Added to ${path.basename(indexHTMLPath)}.`);
          })
        })
      })
    })
  })
}
async function mergeStyleCssFile() {
 await fs.promises.readdir(fPathStyle, { withFileTypes: true })
  .then(elements => {
    for (let file of elements) {
      if (file.isFile()) {
        const extension = path.extname(file.name)
        if (extension === '.css') {
          fs.readFile(path.join(fPathStyle, file.name), 'utf-8', (err, content) => {
            if (err) {
              throw err;
            }
            fs.appendFile(stCssPath, content, (err) => {
              if (err) {
                throw  err;
              }
              console.log(`Styles: ${file.name} / Merged to ${path.basename(stCssPath)}.`);
            });
          })
        }
      }
    }
  })
  .catch(err => {
    console.log(err)
  })
}

async function clearCssFile() {
  await fs.truncate(stCssPath, 0, (err) => {
    if (err) {
      throw err
    }
    console.log(`${path.basename(stCssPath)} cleared.`)})
}

async function copyAssetsFile() {
  await start(filePathSec);
  await fs.readdir(filePathF, (err, elements) => {
    if (err) {
      throw err;
    }
    for (let el of elements) {
      fs.mkdir(path.join(filePathSec, el), {recursive: true}, (err) => {
        if (err) {
          throw err;
        }
      });
      const assetsOriginFolder = path.join(filePathF, el);
      const assetsCopyFolder = path.join(filePathSec, el);
      fs.readdir(assetsOriginFolder, (err, items) => {
        if (err) {
          throw err
        }
        for (const item of items) {
            fs.copyFile(path.join(assetsOriginFolder, item), path.join(assetsCopyFolder, item), fs.constants.COPYFILE_EXCL, (err) => {
                if (err) {
                  process.exit();
                }
                console.log(`Copied: ${item} / To folder: ${path.basename(assetsCopyFolder)}`);
            });
        }
    });
    }
  })
}
async function build() {
  await start(mFolderPath);
  setTimeout(() => {
    changeTemplate();
  }, 500);
  setTimeout(() => {
    mergeStyleCssFile();
  }, 500);
  setTimeout(() => {
    copyAssetsFile();
  }, 500);
}
build();
