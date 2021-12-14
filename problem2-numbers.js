const NaiveBayes = require("./naive-bayes")
const bonsole = require('bonsole')

const { trainingData, testingData } = require('./data/digits')

const classifier = new NaiveBayes({
  tokenizer: arr => { return arr.map(number => String(number)) }
})

for (const item of trainingData) {
  classifier.learn(item.normalizeData, String(item.char));
}

function print(data) {
  const str = data.map(item => {
      item = Math.round(item * 2)/2
      if (item > 0.5) {
          return '#'
      } else if (item < 0.5) {
          return '.'
      } else {
          return '+'
      }
  }).map((item, index) => ((index % 28 === 0) ? '\n' : '') + item).join('')
  bonsole(str)
}

let length = 0
let errors = 0
for (const item of testingData) {
  length++

  const result = classifier.categorize(item.normalizeData)

  if (result !== String(item.char)) {
    errors++
    print(item.data)
    print(item.normalizeData)
    bonsole(item.char)
  } else {
  }
}

console.log(`error rate: ${(errors/length) * 100}%`)