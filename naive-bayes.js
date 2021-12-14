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
        this.table[i][key] = Math.max(this.table[i][key]/total, 0.01)
      }
    }
  }

  run(data) {
    let num = 1
    for (let i = 0; i < this.table.length; i++) {
      const val = data[i]
      const prob = this.table[i][val] ?? 0.01
      num *= prob
    }

    return num
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
    let output = null

    let max = null
    for (const label in this.tables) {
      const result = this.tables[label].run(data)
      if (max === null) {
        max = result
        output = label
      } else if(result > max) {
        max = result
        output = label
      }
    }

    return output
  }
}

function createNetwork(...args) {
  return new NaiveBayes(...args)
}

exports.createNetwork = createNetwork