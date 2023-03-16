# Chapter 05

## 함수

### 5.1 함수 매개변수

명시적 타입 정보가 선언되지 않으면 절대 타입을 알 수 없다. 타입스크립트가 이를 any 타입으로 간주하며 매개변수의 타입은 무엇이든 될 수 있다.

### 5.1.1 필수 매개변수

자바스크립트에서는 인수의 수와 상관없이 함수를 호출할 수 있다. 하지만 타입스크립트는 함수에 선언된 모든 매개변수가 필수라고 가정한다.

함수에 필수 매개변수를 제공하도록 강제하면 예상되는 모든 인수값을 함수 내에 존재하도록 만들어 타입 안정성을 강화하는 데 도움이 된다.

### 5.1.2 선택적 매개변수

자바스크립트에서 함수 매개변수가 제공되지 않으면 함수 내부의 인수값은 `undefined`로 기본값이 설정된다는 것을 떠올려보자. 때로는 함수 매개변수를 제공할 필요가 없을 떄도 있고, `undefined`값을 위해 의도적으로 사용할 수도 있다.

우리는 타입스크립트가 이러한 선택적 매개변수에 인수를 제공하지 못하는 경우, 타입 오류를 내지 않았으면 한다. 따라서, 타입 애너테이션의 `:` 앞에 `?`를 추가해 매개변수가 선택적이라고 표시한다.

함수 호출에 선택적 매개변수를 제공할 필요는 없다. 선택적 매개변수에는 항상 `| undefined`가 유니언 타입으로 추가되어 있다.

```typescript
function announceSong(song: string, singer?: string) {
  console.log(`Song: ${song}`);

  if (singer) {
    console.log(`Song: ${singer}`);
  }
}

announceSong('Greensleeves'); // Ok
announceSong('Greensleeves', undefined); // Ok
announceSong('Chandelier', 'sia'); // Ok
```

위의 코드에서 singer 매개변수는 선택 사항으로 표시된다. 타입은 `string | undefined`이며 함수 호출자가 singer 매개변수를 위한 인수를 제공할 필요가 없다. 항상 암묵적으로 `undefined`가 될 수 있고, if문에 따라 string 타입으로 좁혀진다.

함수에서 사용되는 모든 선택적 매개변수는 마지막 매개변수여야 한다. 필수 매개변수 전에 선택적 매개변수를 위치시키면 다음과 같이 타입스크립트 구문 오류가 발생한다.

```typescript
function announceSong(singer?: string, song: string) {}
// Error: A required parameter cannot follow an optional parameter.
```

### 5.1.3 기본 매개변수

타입스크립트의 타입 추론은 초기 변숫값과 마찬가지로 기본 함수 매개변수에 대해서도 유사하게 작동한다. 매개변수에 기본값이 있고 타입 애너테이션이 없는 경우, 타입스크립트는 해당 기본값을 기반으로 매개변수 타입을 유추한다.

```typescript
function rateSong(song: string, rating = 0) {
  console.log(`${song} gets ${rating}/5 stars!`);
}

rateSong('Photograph'); // Ok
rateSong('Set Fire to the Rain', 5); // Ok
rateSong('Set Fire to the Rain', undefined); // Ok

rateSong('At Last!', '100');
// Error: Argument of type '"100"' is not assignable to parameter of type 'number | undefined'.
```

위의 코드에서 rating은 `number` 타입으로 추론이 되지만, 함수를 호출하는 코드에서는 선택적 `number | undefined`가 된다. 즉, 기본값을 지정하면 선택적 매개변수처럼 동작함.

### 5.1.4 나머지 매개변수(rest parameter)

타입스크립트는 이러한 rest parameter의 타입을 일반 매개변수와 유사하게 선언할 수 있다. 단, 인수 배열을 나타내기 위해 끝에 `[]` 구문이 추가된다는 점만 다르다.

```typescript
function singAllTheSongs(singer: string, ...songs: string[]) {
  for (const song of songs) {
    console.log(`${song}, by ${singer}`);
  }
}

singAllTheSongs('Alicia Keys'); // Ok
singAllTheSongs('Lady Gaga', 'Bad Romance', 'Just Dance', 'Poker Face'); // Ok

singAllTheSongs('Ella Fitzgerald', 2000);
// Error: Argument of type 'number' is not assignable to parameter of type 'string'.
```

위의 코드를 보면 **songs라는 rest parameter에 대해 0개 이상의 string 타입 인수를 사용할 수 있다.**

### 5.2 반환 타입

타입스크립트는 지각적(perceptive)이다. 함수가 반환할 수 있는 가능한 모든 값을 이해하면 함수가 반환하는 타입을 알 수 있다.

```typescript
// 타입: (songs: string[] => number)
function singSongs(songs: string[]) {
  for (const song of songs) {
    console.log(`${song}`);
  }
  return songs.length;
}
```

함수에 다른 값을 가진 여러 개의 반환문을 포함하고 있다면, 타입스크립트는 반환 타입(return type)을 가능한 모든 반환 타입의 조합으로 유추한다.

### 5.2.1 명시적 반환 타입

변수와 마찬가지로 타입 애너테이션을 사용해 함수의 반환 타입을 명시적으로 선언하지 않는 것이 좋다. **그러나 특히 함수에서 반환 타입을 명시적으로 선언하는 방식이 매우 유용할 때가 있다.**

- 가능한 반환값이 많은 함수가 항상 동일한 타입의 값을 반환하도록 강제한다.
- 타입스크립트는 재귀 함수의 반환 타입을 통해서 타입을 유추하는 것을 거부한다.
- 수백 개 이상의 타입스크립트 파일이 있는 매우 큰 프로젝트에서 타입스크립트 타입 검사 속도를 높일 수 있다.

함수 선언식에서는 매개변수 목록이 끝나는 `)` 다음에 반환 타입 애너테이션이 배치된다.

```typescript
function singSongsRecursive(songs: string[], count = 0): number {
  return songs.length ? singSongsRecursive(songs.slice(1), count + 1) : count;
}
```

화살표 함수의 경우 `=>` 앞에 배치된다.

```typescript
const singSongsRecursive = (songs: string[], count = 0): number =>
  songs.length ? singSongsRecursive(songs.slice(1), count + 1) : count;
```

함수의 반환문이 반환 타입으로 할당할 수 없는 값을 반환하는 경우 할당 가능성 오류를 표시한다.

### 5.3 함수 타입

자바스크립트에서는 함수를 값으로 전달할 수 있다. 즉, 함수를 가지기 위한 매개변수 또는 변수의 타입을 선언하는 방법이 필요하다.

1. 매개변수가 없고, string 타입을 반환하는 함수

```typescript
let notingInFivesString: () => string;
```

2. string[] 매개변수와 count 선택적 매개변수 및 number값을 반환하는 함수

```typescript
let notingInFivesString: (songs: string[], count?: number) => number;
```

함수 타입은 콜백 매개변수(함수로 호출되는 매개변수)를 설명하는 데 자주 사용된다.

```typescript
const songs = ['Juice', 'Shake If Off', "What's Up"];

function runOnSongs(getSongAt: (index: number) => string) {
  for (let i = 0; i < songs.length; i += 1) {
    console.log(getSongAt(i));
  }
}

function getSongAt(index: number) {
  return `${songs[index]}`;
}

runOnSongs(getSongAt); // Ok

function logSong(song: string) {
  return `${song}`;
}

runOnSongs(logSong);
// Error: Argument of type '(song: string) => string' is not assignable to parameter of type '(index: number) => string'.
// Types of parameters 'song' and 'index' are incompatible.
// Type 'number' is not assignable to type 'string'.
```

위의 runOnSongs 함수는 getSongAt 매개변수의 타입을 index: number를 받고 stirng을 반환하는 함수로 선언했다. getSongAt을 전달하면 해당 타입과 일치하지만, logSong은 매개변수로 number 대신 string을 사용하므로 반환값을 가져오는데 실패한다.

`runOnSongs(logSong)`에 대한 오류 메시지는 할당 가능성 오류의 예로 몇 가지 상세한 단계까지 제공한다.

1. 첫 번째 들여쓰기 단계는 **두 함수 타입을 출력**한다.
2. 다음 들여쓰기 단계는 **일치하지 않는 부분을 지정**한다.
3. 마지막 들여쓰기 단계는 **일치하지 않는 부분에 대한 정확한 할당 가능성 오류를 출력**한다.

### 5.3.1 함수 타입 괄호

함수 타입은 다른 타입이 사용되는 모든 곳에 배치할 수 있다. 여기에는 유니언 타입도 포함된다.

```typescript
// 타입은 string | undefined 유니언을 반환하는 함수
let returnsStringOrUndefined: () => string | undefined;

// 타입은 undefined나 string을 반환하는 함수
let maybeReturnsString: (() => string) | undefined;
```

### 5.3.2 매개변수 타입 추론

모든 함수에 대해 매개변수를 선언해야 한다면 번거로울 것이다. 다행히도 타입스크립트는 선언된 타입의 위치에 제공된 함수의 매개변수 타입을 유추할 수 있다.

```typescript
let singer: (song: string) => string;

singer = function (song) {
  // song: string 타입
  return `Singing: ${song.toUpperCase()!}`; // Ok
};
```

위의 singer 변수는 string 타입의 매개변수를 갖는 함수로 지정하여, 나중에 singer가 할당되는 함수 내의 song 매개변수는 string으로 예측된다.

### 5.3.3 함수 타입 별칭

함수 타입에서도 타입 별칭을 사용할 수 있다.

```typescript
type StringToNumber = (input: string) => number;

let stringToNumber: StringToNumber;

stringToNumber = (input) => input.length; // Ok

stringToNumber = (input) => input.toUpperCase();
// Error: Type 'string' is not assignable to type 'number'.
```

위의 StringToNumber 타입은 string 타입을 받고, number 타입을 반환하는 함수의 별칭을 지정한다.

### 5.4 그 외 반환 타입

지금부터 void와 never, 두 반환 타입에 대해 알아보자.

### 5.4.1 void 반환 타입

일부 함수는 어떤 값도 반환하지 않는다. 예를 들면 return 문이 없는 함수이거나 값을 반환하지 않는 return 문을 가진 함수일 경우다. 타입스크립트는 void 키워드를 사용해 반환값이 없는 함수의 반환 타입을 확인 할 수 있다.

```typescript
function logSong(song: string | undefined): void {
  if (!song) {
    return; // Ok
  }

  console.log(`${song}`);

  return true;
  // Error: Type 'boolean' is not assignable to type 'void'.
}
```

위의 logSong 함수는 void를 반환하도록 선언되었기 때문에 값 반환을 허용하지 않는다.

함수 타입 선언 시 void 반환 타입은 매우 유용하다. 함수 타입을 선언할 때 void를 사용하면 함수에서 반환되는 모든 값은 무시된다.

**자바스크립트 함수는 실제값이 반환되지 않으면 기본적으로 모두 undefined를 반환하지만, void는 undefined와 동일하지 않다.** void는 함수의 반환 타입이 무시된다는 것을 의미하고 undefined는 반환되는 리터럴 값이다. undefined를 포함하는 대신 void 타입의 값을 할당하려고 하면 타입 오류가 발생한다.

```typescript
function returnsVoid() {
  return;
}

let lazyValue: string | undefined;

lazyValue = returnsVoid();
// Error: Type 'void' is not assignable to type 'string | undefined'.
```

undefined와 void를 구분해서 사용하면 매우 유용하다. 특히 void를 반환하도록 선언된 타입 위치에 전달된 함수가 반환된 모든 값을 무시하도록 설정할 때 유용하다.

void 타입은 함수의 반환 타입을 선언하는 데 사용하는 키워드이다. void 타입은 함수의 반환값이 자체적으로 반환될 수 있는 값도 아니고, 사용하기 위한 것도 아니라는 표시임을 기억하자.

### 5.4.2 never 반환 타입

일부 함수는 값을 반환하지 않을 뿐만 아니라 반환할 생각도 전혀 없다. never 반환 함수는 (의도적으로) 항상 오류를 발생기키거나 무한 루프를 실행하는 함수이다.

```typescript
function fail(message: string): never {
  throw new Error(`Invariant failure: ${message}.`);
}

function workWithUnsafeParam(param: unknown) {
  if (typeof param !== 'string') {
    fail(`param should be a string, not ${typeof param}`);
  }

  // 여기서 param의 타입은 string으로 알려진다.
  param.toUpperCase(); // Ok
}
```

위의 예제를 보자. 함수가 절대 반환하지 않도록 never 타입 애너테이션을 추가하고 해당 함수를 호출한 후 모든 코드가 실행되지 않음을 나타낸다. fail 함수는 오류만 발생시키므로 param 타입을 string으로 좁혀서 타입스크립트의 제어 흐름 분석을 도와준다.

**never은 void와는 다르다. void는 아무것도 반환하지 않는 함수를 위한 것이고, never은 절대 반환하지 않는 함수를 위한 것이다.**

### 5.5 함수 오버로드

일부 함수는 선택적 매개변수와 나머지 매개변수(rest parameter)만으로 표현할 수 없는 매우 다른 매개변수들로 호출될 수 있다. 이러한 함수는 **오버로드 시그니처(overload signature)** 라고 불리는 타입스크립트 구문으로 설명할 수 있다. 즉, 하나의 최종 구현 시그니처와 그 함수의 본문 앞에 서로 다른 버전의 함수 이름, 매개변수, 반환 타입을 여러 번 선언한다.

오버로드된 함수 호출에 대해 구문 오류를 생성할지 여부를 결정할 때 타입스크립트는 함수의 오버로드 시그니처만 확인한다. 구현 시그니처는 함수의 내부 로직에서만 사용된다.

```typescript
function createDate(timestamp: number): Date;
function createDate(month: number, day: number, year: number): Date;
function createDate(monthOrTimestamp: number, day?: number, year?: number) {
  return day === undefined || year === undefined ? new Date(monthOrTimestamp) : new Date(year, monthOrTimestamp, day);
}

createDate(554356800); // Ok
createDate(7, 27, 1987); // Ok

createDate(4, 1);
// Error: No overload expects 2 arguments, but overloads do exist that expect either 1 or 3 arguments.
```

위의 코드에서 crateDate 함수는 2개의 인수를 사용해 호출하면 2개의 인수를 허용하는 오버로드 시그니처가 없기 때문에 타입 오류가 발생한다.

예제의 처음 두 줄은 오버로드 시그니처이고 세 번째 줄은 구현 시그니처 코드이다. 타입스크립트를 컴파일해 자바스크립트로 출력하면 오버로드 시그니처는 날라간다.

함수 오버로드는 복잡하고 설명하기 어려운 함수 타입에 사용하는 최후의 수단이다. 함수를 단순하게 유지하고 가능하면 함수 오버로드를 사용하지 않는 것이 좋다. 안써야징

### 5.5.1 호출 시그니처 호환성

구현 시그니처는 모든 오버로드 시그니처와 호환되어야 한다.

### 5.6 마치며

이번 장에서는 타입스크립트에서 함수의 매개변수와 반환 타입을 유추하거나 명시적으로 선언하는 방법을 살펴보았다.
