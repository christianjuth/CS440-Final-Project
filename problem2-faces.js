const NaiveBayes = require("./naive-bayes")

const { trainingData, testingData } = require('./data/faces')

const classifier = new NaiveBayes()

// for (let i = 0; i < 500; i++) {
  for (const item of trainingData) {
    classifier.learn(item.normalizeData.join(' '), item.isFace ? 'face' : 'not-face');
  }
// }

let length = 0
let errors = 0
for (const item of testingData) {
  length++

  const result = classifier.categorize(item.normalizeData.join(' '))

  if (result !== (item.isFace ? 'face' : 'not-face')) {
    errors++
  }
}

console.log(`error rate: ${(errors/length) * 100}%`)