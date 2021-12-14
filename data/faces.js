const fs = require('fs')
const path = require('path')
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
const COLS = 60
exports.COLS = COLS
const ROWS = 70
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

      const data = charData.map(row => row.split('').map(char => char === " " ? 0 : 1)).flat()

      table.push({
        isFace: parseInt(labels[charIndex]),
        visual: charData.join('\n'),
        data,
        normalizeData: normalizeImage(data, ROWS, COLS),
        small: normalizeImage(data, ROWS, COLS, 10, 15)
      })
      charData = []
      charIndex++
    }

    charData.push(row)
    i++
  }

  return table
}

const trainingData = loadData(
  path.join(__dirname, 'facedata', 'facedatatrain'), 
  path.join(__dirname, 'facedata', 'facedatatrainlabels')
)
exports.trainingData = trainingData
const testingData = loadData(
  path.join(__dirname, 'facedata', 'facedatatest'), 
  path.join(__dirname, 'facedata', 'facedatatestlabels')
)
exports.testingData = testingData


function validate(data) {
  let max = -Infinity
  let min = Infinity

  data.forEach(item => {
    max = Math.max(max, item.data.length)
    min = Math.min(min, item.data.length)
  })

  return max === min
}

if (!validate(trainingData) || !validate(testingData)) {
  throw Error('data is not consistent')
}