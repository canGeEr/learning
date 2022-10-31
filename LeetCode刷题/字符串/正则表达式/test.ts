const IndexModule = require('./index');

const wordCollection = new IndexModule.WordCollection()

wordCollection.add("bad")
wordCollection.add("dad")
wordCollection.add("mad")

;[
  'p.ad', '..ad', 'd..'
].map(str => console.log(wordCollection.search(str)))
