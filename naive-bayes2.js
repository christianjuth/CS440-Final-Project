// const bonsole = require('bonsole')

class Table {
  constructor(size) {
    // array of empty objects
    this.table = Array(size).fill(0).map(() => ({}))
  }

  train(data) {
    for (let i = 0; i < data.length; i++) {
      const tableItem = this.table[i]
      const value = data[i]
      tableItem[value] = tableItem[value] ?? 0
      tableItem[value] += 1
    }
  }

  convertToProbabilities() {
    for (let i = 0; i < this.table.length; i++) {
      const total = Object.values(this.table[i]).reduce((acc,val) => acc + val, 0)
      for (let key in this.table[i]) {
        this.table[i][key] = Math.max(this.table[i][key]/total, 0.01) + 1
      }
    }

  }

  run(data) {
    let totalProbability = Number.MAX_SAFE_INTEGER
    for (let i = 0; i < this.table.length; i++) { 
      const val = data[i]
      const probability = this.table[i][val] ?? 0.01
      let prev = totalProbability
      totalProbability *= probability
      if (totalProbability === 0) {
        console.log(prev, probability)
        break
      }
    }
    return totalProbability
  }
}

class NaiveBayes {

  constructor(options) {
    this.options = {
      ...options
    }

    this.tables = {}
  }

  trainOnce(data, label) {
    this.tables[label] = this.tables[label] ?? new Table(this.options.inputSize)
    this.tables[label].train(data)
  }

  train(allData) {
    if (this.isLocked) {
      throw Error('network has already been trained')
    }
    for (const { input, output } of allData) {
      this.trainOnce(input, output)
    }
    for (const label in this.tables) {
      this.tables[label].convertToProbabilities()
    }
    this.isLocked = true
  }

  run(data) {
    let results = []
    for (const label in this.tables) {
      const result = this.tables[label].run(data)
      results.push(result)
    }

    const max = Math.max(...results)
    return Object.keys(this.tables)[results.indexOf(max)]
  }
}

function createNetwork(...args) {
  return new NaiveBayes(...args)
}

exports.createNetwork = createNetwork

// const net = createNetwork({
//   inputSize: 10
// })


// net.train([
//   { input: [0,0,0,0,1,0,0,0,0,0], output: 'true' },
//   { input: [0,0,0,0,0,0,0,0,0,0], output: 'false' }
// ])

// console.log(net.run([0,0,0,0,0,0,0,0,0,0]))