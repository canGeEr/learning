const IndexModule = require('./index');


[
  'aaa', 'bbb', 'aba', 'baa', 'abb',
  'helleh', 'bcaddacb', 'shepaijibpehs'
].map(str => console.log(IndexModule.deleteOneSsPalindrome(
  str
  )))
  