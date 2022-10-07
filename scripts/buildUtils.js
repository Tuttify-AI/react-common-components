const fs = require('fs');

const EXCLUDED_FOLDERS = ['utils'];

export const getFolders = (entry) => {
   const dirs = fs.readdirSync(entry)
   return dirs.filter(name => name !== 'index.ts').filter(name => !EXCLUDED_FOLDERS.includes(name));
}

export const getFiles = (entry, extensions = [], excludeExtensions = []) => {
  let fileNames = [];
  const dirs = fs.readdirSync(entry);
  dirs.forEach((dir) => {
    const path = `${entry}/${dir}`;
   
    if (fs.lstatSync(path).isDirectory()) {
      fileNames = [
        ...fileNames,
        ...getFiles(path, extensions, excludeExtensions),
      ];

      return;
    }

    if (!excludeExtensions.some((exclude) => dir.endsWith(exclude))
      && extensions.some((ext) => dir.endsWith(ext))
    ) {
      fileNames.push(path);
    }
  });
  return fileNames;
};