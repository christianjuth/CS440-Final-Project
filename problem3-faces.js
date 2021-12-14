const { trainingData, testingData } = require('./data/faces')
const brain = require('brain.js')

// provide optional config object (or undefined). Defaults shown.
const config = {
  binaryThresh: 0.5,
  hiddenLayers: [20], // array of ints for the sizes of the hidden layers in the network
  activation: 'sigmoid', // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh'],
  // leakyReluAlpha: 0.01, // supported for activation type 'leaky-relu'
  errorThresh: 0.0008,
  log: true,
  logPeriod: 1,
  iterations: 1000
};

// create a simple feed forward neural network with backpropagation
const net = new brain.NeuralNetwork(config);

net.train(
  trainingData.map(item => ({
    input: item.data,
    output: [item.isFace]
  }))
);


let len = 0
let err = 0
for (const item of testingData) {
  len++
  const isFace = net.run(item.data)[0] >= 0.5 ? 1 : 0
  if (isFace !== item.isFace) {
    err++
  }
}

console.log(`TESTING DATA ACCURACY: ${(1-(err/len))*100}%`)