const fs = require('fs')
const { normalizeImage } = require('./utils')

function padArray(arr, length, paddingElement = ' ', disperse = false) {
  const paddingLength = length - arr.length
  if (paddingLength <= 0) {
    return arr
  }
  const padding = Array(paddingLength).fill(paddingElement)
  if (disperse) {
    const midpoint = Math.floor(arr.length/2)
    return [...padding.slice(0, midpoint), ...arr, ...padding.slice(midpoint)]
  }
  return [...arr, ...padding]
}

// These values are used to normlaize the data so its all the same size
const COLS = 28
exports.COLS = COLS
const ROWS = 28
exports.ROWS = ROWS

function loadData(dataFile, labelsFile) {
  const table = []

  // Load files
  const data = fs.readFileSync(dataFile, 'utf8').split('\n')
  const labels = fs.readFileSync(labelsFile, 'utf8').split('\n')

  let charIndex = 0
  let charData = []

  // Associate data with labels
  let i = 0
  for (const row of data) {
    if (i > 0 && i % ROWS === 0) {
      charData = padArray(
        charData.map(row => padArray(row.split(''), COLS).join('')), 
        ROWS,
        ' '.repeat(COLS),
        true
      )

      const data = charData.map(row => row.split('').map(char => { 
        switch (char) {
          case ' ':
            return 0
          case '+':
            return 0.5
          default:
            return 1
        }
      })).flat()

      table.push({
        char: parseInt(labels[charIndex]),
        visual: charData.join('\n'),
        data,
        normalizeData: normalizeImage(data, ROWS, COLS),
        small: normalizeImage(data, ROWS, COLS, 10, 10)
      })
      charData = []
      charIndex++
    }

    charData.push(row)
    i++
  }

  return table
}

exports.trainingData = loadData('./data/digitdata/trainingimages', './data/digitdata/traininglabels')
exports.testingData = loadData('./data/digitdata/testimages', './data/digitdata/testlabels')