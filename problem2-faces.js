const { createNetwork } = require('./naive-bayes')
const { trainingData, testingData } = require('./data/faces')

let net = createNetwork({
  inputSize: 10 * 15
})

net.train(
  trainingData.map(({ small, isFace }) => ({
    input: small,
    output: isFace
  }))
)

let err = 0
let len = 0
for (const item of testingData) {
  len++
  if (net.run(item.small) != item.isFace) {
    err++
  }
}

console.log(`TESTING DATA ACCURACY: ${(1-(err/len))*100}%`)