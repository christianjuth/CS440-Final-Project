const { createNetwork } = require('./naive-bayes2')
const { trainingData, testingData, ROWS, COLS } = require('./data/faces')

let net = createNetwork({
  inputSize: ROWS * COLS
})


net.train(
  testingData.map(({ data, isFace }) => ({
    input: data,
    output: isFace
  }))
)


for (const item of testingData) {
  console.log(net.run(item.data), '==', item.isFace)
}



// const classifier = new NaiveBayes()

// // for (let i = 0; i < 500; i++) {
//   for (const item of trainingData) {
//     classifier.learn(item.normalizeData.join(' '), item.isFace ? 'face' : 'not-face');
//   }
// // }

// let length = 0
// let errors = 0
// for (const item of testingData) {
//   length++

//   const result = classifier.categorize(item.normalizeData.join(' '))

//   if (result !== (item.isFace ? 'face' : 'not-face')) {
//     errors++
//   }
// }

// console.log(`error rate: ${(errors/length) * 100}%`)