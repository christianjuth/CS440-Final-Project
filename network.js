
function random(min, max) {
  return (Math.random() * (max - min)) + min
}

class Matrix {
  constructor(width, height) {
    this.width = width
    this.height = height
    this.data = Array(height * width).fill(1)
  }

  randomize(min, max) {
    this.data = this.data.map(() => random(min, max))
    return this
  }

  get(x, y) {
    return this.data[y*this.width + x]
  }

  set(x, y, val) {
    this.data[y*this.width + x] = val
  }

  shift(x, y, val) {
    this.data[y*this.width + x] += val 
  }
}

class Network {
  learningRate = 0.1
  bias = 1

  constructor(layers) {
    layers[0]++ // add bias
    this.layers = layers

    this.weights = []
    for (let i = 0; i < layers.length - 1; i++) {
      const layerSize = layers[i]
      const nextLayerSize = layers[i+1]
      this.weights.push(
        (new Matrix(layerSize, nextLayerSize)).randomize(-1, 1)
      )
      // this.weights[0].data[this.weights[0].data.length] = 1
    }
  }

  train(data, expectedOutput) {
    data = [...data, this.bias]
    const result = this.run(data)

    for (let x = 0; x < data.length; x++) {
      for (let y = 0; y < result.length; y++) {
        const d = this.delta(
          result[y], 
          expectedOutput[y],
          data[x]
        )
        this.weights[0].shift(x, y, d)
      }
    }
  }
  
  delta(actual, expected, input, learnrate = this.learningRate) {
    return (expected - actual) * input * learnrate
  }

  activate(data, layerIndex = 1) {
    if (this.layers[layerIndex] === undefined) {
      return data
    }

    const nextLayerSize = this.layers[layerIndex] 
    const activation = Array(nextLayerSize).fill(0)
    const weights = this.weights[layerIndex-1]

    for (let x = 0; x < data.length; x++) {
      for (let y = 0; y < weights.height; y++) {
        activation[y] += data[x] * weights.get(x, y)
      }
    }

    return this.activate(activation, layerIndex+1)
  }

  run(data, round = true) {
    const w = this.weights[0].data.slice(-1)[0]
    const result = this.activate(data).map(r => r+w)
    return round ? result.map(v => v > 0 ? 1 : 0) : result
  }
}

function createNetwork(...params) {
  return new Network(...params)
}

module.exports = createNetwork


// const net = createNetwork([2, 1])

// for (let i = 0; i < 1000; i++) {
//   net.train([0,0], [0])
//   net.train([0,1], [1])
//   net.train([1,0], [1])
//   net.train([1,1], [1])
// }

// console.log(
//   net.run([0,0]),
//   net.run([0,1]),
//   net.run([1,0]),
//   net.run([1,1])
// )

// const net = createNetwork([2,2])

// for (let i = 0; i < 1000; i++) {
//   net.train([0,0], [0,0])
//   net.train([0,1], [0,1])
//   net.train([1,0], [1,0])
//   net.train([1,1], [1,1])
// }

// console.log(
//   net.run([0,0]),
//   net.run([0,1]),
//   net.run([1,0]),
//   net.run([1,1])
// )