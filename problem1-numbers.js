const { createMultiNetwork } = require('./perceptron')
const { trainingData, testingData, COLS, ROWS } = require('./data/digits')

const net = createMultiNetwork(
  {
    inputSize: COLS*ROWS,
    errorThresh: 0.025,
    learningRate: 0.3
  },
  9
)

net.train(
  trainingData.map(item => ({
    input: item.data,
    output: item.char
  }))
)

let len = 0
let err = 0
for (const item of testingData) {
  let result = net.run(item.data)
  if (item.char !== result) {
    err++
  }
  len++
}
console.log(`TESTING DATA ACCURACY: ${(1-(err/len))*100}%`)