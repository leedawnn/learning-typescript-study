// let a: string | number[];

// let b: (string | number)[];

// a = ['1', 2]; // '(string | number)[]' 형식은 'string | number[]' 형식에 할당할 수 없습니다.

// b = ['1', 2];

// const c: string | number = 1;
// const d: string | number = '2';
// const e: string | number = 3;
// const f: string | number = '4';

// a = [c, e]; // 오.. 이렇게 하니까 에러 안남

// a = [d, f]; // 'string[]' 형식은 'string | number[]' 형식에 할당할 수 없습니다.

// function logWarriors(greeting: string, ...names: string[]) {
//   for (const name of names) {
//     console.log(`${greeting}, ${name}!`);
//   }
// }

// const warriors = ['Cathay Williams', 'Lozen', 'Nzinga'];

// logWarriors('Hello', ...warriors);

// const birthYears = [1844, 1840, 1583]; // number[]

// logWarriors('Born in', ...birthYears);

// let [year, warrior] = Math.random() > 0.5 ? [340, 'Archidamia'] : [1828, 'Rani of Jhansi'];

// console.log(typeof year); // number
// console.log(typeof warrior); // string

// const pairLoose = [false, 123];

// const aaa = [false, 999, 10000];

// const pairTupleLoose: [boolean, number] = pairLoose;

// const bbb: [boolean, number] = [false, 123]; // 직접 할당은 Ok

// function logPair(name: string, value: number) {
//   console.log(`${name} has ${value}`);
// }

// const pairArray = ['Amage', 1];
// logPair(...pairArray);

// const pairTupleIncorrect: [number, string] = [1, 'Amage'];

// logPair(...pairTupleIncorrect);

// const pairTupleCorrect: [string, number] = ['Amage', 1];

// logPair(...pairTupleCorrect); // Ok

// function logTrio(name: string, value: [number, boolean]) {
//   console.log(`${name} has ${value[0]} (${value[1]})`);
// }

// const trios: [string, [number, boolean]][] = [
//   ['Amanitore', [1, true]],
//   ['AEthelflaed', [2, false]],
//   ['Ann E. Dunwoody', [3, false]],
// ];

// trios.forEach((trio) => logTrio(...trio)); // Ok

// trios.forEach(logTrio);

// function firstCharAndSize(input: string) {
//   return [input[0], input.length];
// }

// // firstChar 타입: string | number
// // size 타입: string | number
// const [firstChar, size] = firstCharAndSize('Gudit');

// console.log(typeof firstChar);
// console.log(typeof size);
