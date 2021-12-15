const { trainingData, testingData } = require('./data/digits')
const brain = require('brain.js')

// provide optional config object (or undefined). Defaults shown.
const config = {
  binaryThresh: 0.5,
  hiddenLayers: [50], // array of ints for the sizes of the hidden layers in the network
  activation: 'sigmoid', // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh'],
  // leakyReluAlpha: 0.01, // supported for activation type 'leaky-relu'
  errorThresh: 0.01,
  log: true,
  logPeriod: 1,
  iterations: 1000,
  learningRate: 0.5
};

// create a simple feed forward neural network with backpropagation
const net = new brain.NeuralNetwork(config);

net.train(
  trainingData.map(digit => ({
    input: digit.normalizeData,
    output: Array(10).fill(0).map((_, i) => i === digit.char ? 1 : 0)
  }))
);


let err = 0
let len = 0
for (const d of testingData) {
  len++
  const res = net.run(d.normalizeData)
  const max = Math.max(...res)
  const num = res.findIndex(v => v === max)
  if (num !== d.char) {
    err++
  }
}
console.log(`TESTING DATA ACCURACY: ${(1-(err/len))*100}%`)