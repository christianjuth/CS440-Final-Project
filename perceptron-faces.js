const { createNetwork } = require('./network2')
const { trainingData, testingData, COLS, ROWS } = require('./data/faces')

const net = createNetwork({
  inputSize: COLS*ROWS,
  errorThresh: 0.0001
})

net.train(
  trainingData.map(item => ({
    input: item.data,
    output: item.isFace
  }))
)

let len = 0
let err = 0
for (const item of testingData) {
  let result = net.run(item.data)
  if (item.isFace !== result) {
    err++
  }
  len++
}
console.log(`TESTING DATA ACCURACY: ${(1-(err/len))*100}%`)