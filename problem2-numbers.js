const { createNetwork } = require('./naive-bayes')
const { trainingData, testingData } = require('./data/digits')

let net = createNetwork({
  inputSize: 10 * 10
})

net.train(
  trainingData.map(({ small, char }) => ({
    input: small,
    output: char
  }))
)

let err = 0
let len = 0
for (const item of testingData) {
  len++
  const res = net.run(item.small)
  // console.log(`${res} == ${item.char}`)
  if (parseInt(res) !== item.char) {
    err++
  }
}
console.log(`TESTING DATA ACCURACY: ${(1-(err/len))*100}%`)