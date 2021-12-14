class Network {
  itterations = 0

  constructor(options) {
    this.options = {
      learningRate: 0.1,
      errorThresh: 0.15,
      bias: 1,
      ...options
    }

    this.weights = Array(this.options.inputSize).fill(0).map(() => Math.random())
    // add bias
    this.weights.push(1)
  }

  trainOnce(data, expectedOutput) {
    const result = this.run(data)
    data = [...data, this.options.bias]

    for (let x = 0; x < data.length; x++) {
      const d = this.delta(
        result,
        expectedOutput,
        data[x]
      )
      this.weights[x] += d
      if (isNaN(this.weights[x])) throw new Error('weights[' + x + '] went to NaN!!')
    }
  }

  train(allData) {
    let numOfErrors = Infinity

    while (numOfErrors / allData.length > this.options.errorThresh) {
      for (const { input, output } of allData) {
        this.trainOnce(input, output)
      }
      numOfErrors = allData.map(({ input, output }) => this.run(input) !== output).filter(Boolean).length
      console.log(`itteration: ${this.itterations}, error rate: ${numOfErrors / allData.length}`)
      this.itterations++
    }
  }

  delta(actual, expected, input, learnrate = this.options.learningRate) {
    return (expected - actual) * input * learnrate
  }

  activate(data) {
    data = [...data, this.options.bias]

    let activation = 0

    for (let x = 0; x < data.length; x++) {
      activation += data[x] * this.weights[x]
    }

    return activation
  }

  run(data, round = true) {
    const w = this.weights.slice(-1)[0]
    const result = this.activate(data) + w
    return round ? (result > 0 ? 1 : 0) : result
  }
}

function createNetwork(...params) {
  return new Network(...params)
}

function createMultiNetwork(options, outputSize) {
  const networks = Array(outputSize).fill(0).map(() => createNetwork(options))

  function train(allData) {
    let itterations = 0
    for (let i = 0; i < outputSize; i++) {
      const data = allData.map(({ input, output }) => ({
        input,
        output: output === i ? 1 : 0
      }))
      networks[i].itterations = itterations
      networks[i].train(data)
      itterations = networks[i].itterations
    }
  }

  function run(input) {
    let results = networks.map(net => net.run(input, false))

    let max = -Infinity
    for (const r of results) {
      max = Math.max(r, max)
    }

    return results.indexOf(max)
  }

  return { train, run }
}

exports.createMultiNetwork = createMultiNetwork
exports.createNetwork = createNetwork


// const net = createNetwork(2)

// for (let i = 0; i < 1000; i++) {
//   net.train([0, 0], 0)
//   net.train([0, 1], 1)
//   net.train([1, 0], 1)
//   net.train([1, 1], 1)
// }

// console.log(
//   net.run([0, 0]),
//   net.run([0, 1]),
//   net.run([1, 0]),
//   net.run([1, 1])
// )


// const net = createNetwork(2)

// for (let i = 0; i < 1000; i++) {
//   net.train([0, 0], 0)
//   net.train([1, 1], 1)
// }

// console.log(
//   net.run([0, 0]),
//   net.run([1, 1])
// )