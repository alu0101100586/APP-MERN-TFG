function getFilePath(file) {
  const filePath = file.path
  const fixFilePath = filePath.replace(/\\/g, '/')
  const fileSplit = fixFilePath.split('/')
  const fileName = fileSplit[1] + '/' + fileSplit[2]
  return fileName
}

module.exports = {
  getFilePath,
}
