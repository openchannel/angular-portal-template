/**
 * Prepare repository for publish to GitHub.
 *
 * Script :
 * 1) Replace all files with part '-github'.
 *    Example: File 'README-github.md' will be renamed on 'README.md' and override the previous file with this name.
 * 2) Rename from environment.prod.ts to environment.ts and remove another environment.<?>.ts files.
 */

fs = require('fs');

const replaceFileConfig = {
  scanFolder: '../../',
  searchKey: '-github'
}

const modifyEnvFilesConfig = {
  scanFolder: '../../src/environments/',
  primaryEnvFile: 'environment.prod.ts'
}

// --- replace GitGub files ---
readFolder(replaceFileConfig.scanFolder, replaceOnlyGitHubFiles);

function replaceOnlyGitHubFiles(files) {
  files.forEach(oldFileName => {
    if(oldFileName.includes(replaceFileConfig.searchKey)) {
      const oldFilePath =`${replaceFileConfig.scanFolder}${oldFileName.replace(replaceFileConfig.searchKey, '')}`;
      const newFilePath =`${replaceFileConfig.scanFolder}${oldFileName}`;
      renameFile(newFilePath, oldFilePath);
    }
  })
}

// --- replace environment.<?>.ts files ---
readFolder(modifyEnvFilesConfig.scanFolder, setupPrimaryEnvironmentFile);

function setupPrimaryEnvironmentFile(files) {
  // remove not production environments
  files
  .filter(fileName => fileName !== modifyEnvFilesConfig.primaryEnvFile)
  .forEach(fileName => {
    const removeFile = `${modifyEnvFilesConfig.scanFolder}/${fileName}`;
    fs.unlink(removeFile, error => {
      if(error) {
        console.error(`Can\'t remove file : ${removeFile}`);
        process.exit(1);
      }
    })
  })

  // rename production environments to default
  const oldFilePath = `${modifyEnvFilesConfig.scanFolder}${modifyEnvFilesConfig.primaryEnvFile}`;
  const newFilePath = `${modifyEnvFilesConfig.scanFolder}environment.ts`;
  renameFile(oldFilePath, newFilePath);
}

// utils
function renameFile(newFile, oldFile) {
  fs.rename(newFile, oldFile, (error) => {
    if(error) {
      console.log(`Can\'t rename file from ${newFile} to ${oldFile}.`);
      process.exit(1);
    }
  })
}
// utils
function readFolder(path, filesFn) {
  fs.readdir(path, (error, files) => {
    if(error) {
      console.error(`Can\'t read files from directory by path ${path}`, error)
      process.exit(1);
    } else {
      filesFn(files);
    }
  });
}
