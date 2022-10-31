class WordCollection {
  __map: Map<number, string []>
  constructor() {
    this.__map = new Map()
  }

  add(str: string) {
    const index = str.length
    if(!this.__map.get(index)) {
      this.__map.set(index, [])
    }
    this.__map.get(index)?.push(str)
  }

  search(str: string) {
    const index = str.length
    const words = this.__map.get(index)

    if(!words || !words.length) return false

    if(!str.includes('.')) {
      return words.includes(str)
    }

    const regexp = new RegExp(str)

    return words.some(word => regexp.test(word))
  }
}

module.exports = {
  WordCollection
}