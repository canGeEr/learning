let username: string = 'wczix';
let age: number = 22;

let nickname: any = <string>'1';
username  = nickname

let person: { username: string, age: number } = {
  username: 'wczix',
  age: 1
}

let adult: { username: string, age: number, money?: boolean } = {
  username: 'wczix',
  age: 1
}

type FirstNumberObj   = { first:  number };
type SecondNumberObj  = { second: number };

type add = (FirstNumberObj | SecondNumberObj);

const first : add  = { first: 2 }