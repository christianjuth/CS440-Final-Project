const { trainingData, testingData } = require('./data/faces')
const perceptron = require('perceptron')

const and = perceptron({
  learningrate: 0.1
})

for (const item of trainingData) {
  and.train(item.data, item.isFace)
}

function getErrorRate() {
  let error = 0
  for (const item of testingData) {
    const result = and.perceive(item.data)

    if (item.isFace !== result) {
      error++
    } else {
    }
  }
  return (error/testingData.length)*100
}

let ITTERATION = 0
while (true) {
  const errorRate = getErrorRate()
  if (ITTERATION % 1000 === 0) {
    console.log(`itteration: ${ITTERATION}, error rate: ${errorRate}`)
  }
  if (errorRate < 5) {
    break;
  }
  and.retrain()
  ITTERATION++
}

console.log(`itterations: ${ITTERATION}, error rate: ${getErrorRate()}%`)