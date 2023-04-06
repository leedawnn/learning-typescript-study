// function isNumberOrString(value: unknown) {
//   return ['number', 'string'].includes(typeof value);
// }

// function logValueIfExists(value: number | string | null | undefined) {
//   if (isNumberOrString(value)) {
//     value.toString();
//     // 'value'은(는) 'null' 또는 'undefined'일 수 있습니다.
//   } else {
//     console.log('Value does not exist: ', value);
//   }
// }

// function isNumberOrString(value: unknown): value is number | string {
//   return ['number', 'string'].includes(typeof value);
// }

// function logValueIfExists(value: number | string | null | undefined) {
//   if (isNumberOrString(value)) {
//     // value: number | string의 타입
//     value.toString(); // Ok
//   } else {
//     // value: null | undefined의 타입
//     console.log('value does not exist: ', value);
//   }
// }

// interface Comedian {
//   funny: boolean;
// }

// interface StandupComedian extends Comedian {
//   routine: string;
// }

// function isStandupComedian(value: Comedian): value is StandupComedian {
//   return 'routine' in value;
// }

// function workWithComedian(value: Comedian) {
//   if (isStandupComedian(value)) {
//     console.log(value.routine); // Ok
//   }

//   console.log(value.routine);
//   // 'Comedian' 형식에 'routine' 속성이 없습니다.
// }

// function isLongString(input: string | undefined): input is string {
//   return !!(input && input.length >= 7);
// }

// function workWithText(text: string | undefined) {
//   if (isLongString(text)) {
//     console.log('Long text: ', text.length);
//   } else {
//     console.log('Short text: ', text?.length);
//     // 'never' 형식에 'length' 속성이 없습니다.
//   }
// }

// interface Ratings {
//   audience: number;
//   critics: number;
// }

// function getRating(ratings: Ratings, key: string): number {
//   return ratings[key];
// }

// const ratings: Ratings = { audience: 66, critics: 84 };

// getRating(ratings, 'audience'); // Ok

// getRating(ratings, 'not valid'); // 허용되지만 사용하면 안됨

// const original = {
//   medium: 'movie',
//   title: 'Mean Girls',
// };

// let adaptation: typeof original;

// if (Math.random() > 0.5) {
//   adaptation = { ...original, medium: 'play' }; // Ok
// } else {
//   adaptation = { ...original, medium: 2 };
//   // Error: Type 'number' is not assignable to type 'string'.
// }

// const testStr = 'aaa' as number;
// console.log(typeof testStr);

// const seasonCounts = new Map([
//   ['I Love Lucy', 6],
//   ['The Golden Girls', 7],
// ]);

// // 타입: string | undefined
// const maybeValue = seasonCounts.get('I Love Lucy');

// console.log(maybeValue.toUpperCase());
// // Error: Object is possibly 'undefined'.

// // 타입: string
// const knownValue = seasonCounts.get('I Love Lucy')!;

// console.log(knownValue.toUpperCase()); // Ok

// const seasonCounts = new Map([
//   ['Board City', 5],
//   ['Community', 6],
// ]);

// // 타입: string
// const knownValue = seasonCounts.get('I Love Lucy')!;

// console.log(knownValue.toUpperCase());

// interface Entertainer {
//   acts: string[];
//   name: string;
// }

// const declared: Entertainer = {
//   // Error: Propery 'acts' is missing in type '{ one: number; }' but required in type 'Entertainer'.
//   name: 'Moms Mabley',
// };

// const asserted = {
//   name: 'Moms Mabley',
// } as Entertainer; // 허용되지만 런타임 시 오류 발생

// // 다음 구문은 런타임 시 다음 오류로 인해 정상적으로 작동되지 않음
// // Runtime TypeError: Cannot read properties of undefined (reading 'toPrecision')
// console.log(declared.acts.join(', '));
// console.log(asserted.acts.join(', '));

interface Joke {
  quote: string;
  style: 'story' | 'one-liner';
}

function tellJoke(joke: Joke) {
  if (joke.style === 'one-liner') {
    console.log(joke.quote);
  } else {
    console.log(joke.quote.split('\n'));
  }
}

// 타입: { quote: string; style: 'one-liner'; }
const narrowJoke = {
  quote: 'If you stay alive for no other reason do it for spite.',
  style: 'one-liner' as const,
};

tellJoke(narrowJoke); // Ok

// 타입: { quote: string; style: string; }
const wideObject = {
  quote: 'Time flies when you are anxious!',
  style: 'one-liner',
};

tellJoke(wideObject);
