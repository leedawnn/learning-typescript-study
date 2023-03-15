// type Color = {
//   name: string;
//   id: number;
// };

// const yellow = {
//   name: 'yellow',
//   id: 2,
//   hex: '#FFFF00',
// };

// // const hexYellow: Color = yellow; // Ok

// const hexYellow: Color = {
//   name: 'yellow',
//   id: 2,
//   hex: '#FFFF00', // Error
//   // '{ name: string; id: number; hex: string; }' 형식은 'Color' 형식에 할당할 수 없습니다. 개체 리터럴은 알려진 속성만 지정할 수 있으며 'Color' 형식에 'hex'이(가) 없습니다.
// };

// type Poem = {
//   author: {
//     firstName: string;
//     lastName: string;
//   };
//   name: string;
// };

// const poemMatch: Poem = {
//   author: {
//     firstName: 'Sylvia',
//     lastName: 'Plath',
//   },
//   name: 'Lady Lazarus',
// };

// const poemMismatch: Poem = {
//   author: {
//     name: 'Sylvia Plath',
//   },
//   name: 'Tulips',
// };

// 중첩된 객체 타입을 고유한 타입 이름으로 바꾸기
type Author = {
  firstName: string;
  lastName: string;
};

type Poem = {
  author: Author;
  name: string;
};

const poemMismatch: Poem = {
  author: {
    name: 'Sylvia Plath',
  },
  name: 'Tulips',
};
