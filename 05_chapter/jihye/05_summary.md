# 05 함수

이제 함수 매개변수와 반환 타입에서 동일한 작업을 수행하는 방법과 이 방법이 유용한 이유를 살펴보자.

## 5.1 함수 매개변수

명시적 타입 정보가 선언되지 않으면 절대 타입을 알 수 없다. 타입스크립트가 이를 any 타입으로 간주하며 매개변수의 타입은 무엇인든 될 수 있다.

### 5.1.1 필수 매개변수

타입스크립트는 함수에 선언된 모든 매개변수가 필수라고 가정한다. 함수가 잘못된 수의 인수로 호출되면, 타입스크립트는 타입 오류의 형태로 이의를 제기한다.

### 5.1.2 선택적 매개변수

우리는 타입스크립트가 선택적 매개변수에 인수를 제공하지 못하는 경우, 타입 오류를 보고하지 않았으면 한다. 타입스크립트에서는 선택적 객체 타입 속성과 유사하게 타입 애너테이션의 : 앞에 ?를 추가해 매개변수가 선택적이라고 표시한다.

선택적 매개변수는 | undefined를 포함하는 유니언 타입 매개변수와는 다르다. ?으로 표시된 선택적 매개변수가 아닌 매개변수는 값이 명시적으로 undefined일지라도 항상 제공되어야 한다.

```typescript
function announceSongBy(song: string, singer: string | undefined) {
  /* ... */
}

announceSongBy("Greensleeves");
// Error: Expected 2 arguments, but got 1.

announceSongBy("Greensleeves", undefined); // OK
announceSongBy("Chandelier", "Sia"); // OK
```

### 5.1.3 기본 매개변수

자바스크립트에서 선택적 매개변수를 선언할 때 =와 값이 포함된 기본값을 제공할 수 있다. 즉, 선택적 매개변수에는 기본적으로 값이 제공되기 때문에 해당 타입스크립트 타입에는 암묵적으로 함수 내부에 | undefined 유니언 타입이 추가된다. 타입스크립트는 함수의 매개변수에 대해 인수를 누락하거나 undefined 인수를 사용해서 호출하는 것을 여전히 허용한다.

타입스크립트의 타입 추론은 초기 변숫값과 마찬가지로 기본 함수 매개변수에 대해서도 유사하게 작동한다. 매개변수에 기본값이 있고 타입 애너테이션이 없는 경우, 타입스크립트는 해당 기본값을 기반으로 매개변수 타입을 유추한다.

```typescript
function rateSong(song: string, rating = 0) {
  console.log("${song} gets ${rating}/5 stars!");
}

rateSong("photograph"); // OK
rateSong("set Fire to the Rain", 5); // Ok
rateSong("set Fire to the Rain", undefined); // OK

rateSong("At Last!", "100");
// Error: Argument of type '"100"' is not assignable to
// parameter of type 'number | undefined'.
```

### 5.1.4 나머지 매개변수

자바스크립트의 일부 함수는 임의의 수의 인수로 호출할 수 있도록 만들어진다. ... 스프레드 연산자는 함수 선언의 마지막 매개변수에 위치하고, 해당 매개변수에서 시작해 함수에 전달된 '나머지' 인수가 모두 단일 배열에 저장되어야 함을 나타낸다.

타입스크립트는 이러한 나머지 매개변수의 타입을 일반 매개변수와 유사하게 선언할 수 있다. 단, 인수 배열을 나타내기 위해 끝에 [] 구문이 추가된다는 점만 다르다.

## 5.2 반환 타입

타입스크립트는 지각적이다. 함수가 반환할 수 있는 가능한 모든 값을 이해하면 함수가 반환하는 타입을 알 수 있다. 이번 예제에서 singSongs는 타입스크립트에서 number를 반환하는 것으로 확인된다.

```typescript
// 타입: (songs: string[]) => number
function singSongs(songs: string[]) {
  for (const songs of songs) {
    console.log("${song}");
  }

  return songs.length;
}
```

함수에 다른 값을 가진 여러 개의 반환문을 포함하고 있다면, 타입스크립트는 반환 타입을 가능한 모든 반환 타입의 조합으로 유추한다. 다음 코드에서 getSongAt 함수는 string | undefined를 반환하는 것으로 유추된다.

```typescript
// 타입: (songs: string[], index: number) => string | undefined
function getSongAt(songs: string[], index: number) {
  return index < songs.length ? songs[index] : undefined;
}
```

### 5.2.1 명시적 반환 타입

변수와 마찬가지로 타입 애너테이션을 사용해 함수의 반환 타입을 명시적으로 선언하지 않는 것이 좋다. 그러나 특히 함수에서 반환 타입을 명시적으로 선언하는 방식이 매우 유용할 때가 종종 있다.

- 가능한 반환값이 많은 함수가 항상 동일한 타입의 값을 반환하도록 강제한다.
- 타입스크립트는 재귀 함수의 반환 타입을 통해 타입을 유추하는 것을 거부한다.
- 수백 개 이상의 타입스크립트 파일이 있는 매우 큰 프로젝트에서 타입스크립트 타입 검사 속도를 높일 수 있다.

함수의 반환문이 함수의 반환 타입으로 할당할 수 없는 값을 반환하는 경우 타입스크립트는 할당 가능성 오류를 표시한다.

```typescript
function getSongRecordingDate(song: string):
Date | undefined {
    switch (song) {
        case "Strange Fruit"
        return new Date('April 20, 1939');  // OK

        case "Greensleeves";
            return "unknown";
            // Error: Type 'string' is not assignable to type 'Date'.
        default:
            return undefined    // Ok
    }
}
```

## 5.3 함수 타입

자바스크립트에서는 함수를 값으로 전달할 수 있다. 즉, 함수를 가지기 위한 매개변수 또는 변수의 타입을 선언하는 방법이 필요하다.

```typescript
let nothingInGiveString: () => string;
```

함수 타입은 콜백 매개변수(함수로 호출되는 매개변수)를 설명하는 데 자주 사용된다.

```typescript
const songs = ["juice", "Shake It Off", "What's Up"];

function runOnSongs(getSongAt: (index: number) => string) {
  for (let i = 0; i < songs.length; i += 1) {
    console.log(getSongAt(i));
  }
}
function getSongAt(index: number) {
  return "${songs[index]}";
}
runOnSongs(getSongAt); // OK

function logSong(song: string) {
  return "${song}";
}

runOnSongs(logSong);
// Error: Argument of type '(song: string) => string' is not
// assignable to parameter of type '(index: number) => string'.
// Type of parameters 'song' and 'index' are incompatible.
// Type 'number' is not assignable to type 'string'
```

### 5.3.1 함수 타입 괄호

함수 타입은 다른 타입이 사용되는 모든 곳에 배치할 수 있다. 여기에는 유니언 타입도 포함된다.

```typescript
// 타입은 string | undefined 유니언을 반환하는 함수
let returnStringOrUndefined: () => string | undefined;

// 타입은 undefined나 string을 반환하는 함수
let maybeReturnString: (() => string) | undefined;
```

### 5.3.2 매개변수 타입 추론

타입스크립트는 선언된 타입의 위치에 제공된 함수의 매개변수 타입을 유추할 수 있다.

```typescript
let singer: (song: string) => string;

singer = function (song) {
  // song: string의 타입
  return "Singing: ${song.toUpperCase()}!"; // OK
};
```

### 5.3.3 함수 타입 별칭

함수 타입에서도 동일하게 타입 별칭을 사용할 수 있다.

```typescript
type StringToNumber = (input: string) => number;

let stringToNumber: StringToNumber;

stringToNumber = (input) => input.length; // OK

stringToNumber = (input) => input.toUpperCase();
// Error: Type 'string' is not assignable to type 'number'
```

비슷하게 함수 매개변수도 함수 타입을 참조하는 별칭을 입력할 수 있다.

## 5.4 그 외 반환 타입

지금부터 void와 never, 두 반환 타입에 대해 알아봅시다.

### 5.4.1 void 반환 타입

일부 함수는 어떤 값도 반환하지 않는다. 타입스크립트는 void 키워드를 사용해 반환값이 없는 함수의 반환 타입을 확인할 수 있다.

반환 타입이 void인 함수는 값을 반환하지 않을 수 있다. 다음 logSong 함수는 void를 반환하도록 선언되었으므로 값 반환을 허용하지 않는다.

```typescript
function logSong(song: string | undefined): void {
  if (!song) {
    return; // Ok
  }

  console.log("${song}");

  return true;
  // Error: Type 'boolean' is not assignable to type 'void'
}
```

함수 타입 선언 시 void 반환 타입은 매우 유용하다. 함수 타입을 선언할 때 void를 사용하면 함수에서 반환되는 모든 값은 무시된다.

void는 undefined와 동일하지 않다. void는 함수의 반환 타입이 무시된다는 것을 의미하고 undefined는 반환되는 리터럴 값이다.

```typescript
function returnsVoid() {
  return;
}

let lazyValue: string | undefined;

lazyValue = returnsVoid();
// Error: Type 'void' is not assignable to type 'string | undefined'.
```

undefined와 void를 구분해서 사용하면 매우 유용핟. 특히 void를 반환하도록 선언된 타입 위치에 전달된 함수가 반환된 모든 값을 무시하도록 설정할 때 유용하다.

```typescript
const records: string[] = [];

function saveRecords(newRecords: string[]) {
  newRecords.forEach((record) => records.push(record));
}

saveRecords(["21", "Come On Over", "The Bodyguard"]);
```

void타입은 함수의 반환값이 자체적으로 반환될 수 있는 값도 아니고, 사용하기 위한 것도 아니라는 표시임을 기억하자.

### 5.4.2 never 반환 타입

일부 함수는 값을 반환하지 않을 뿐만 아니라 반환할 생각도 전혀 없다. never 반환 함수는 (의도적으로) 항상 오류를 발생시키거나 무한 루프를 실행하는 함수이다.

다음 fail 함수는 오류만 발생시키므로 param의 타입을 string으로 좁혀서 타입스크립트의 제어 분석을 도와준다.

```typescript
function fail(message: string): never {
  throw new Error("Invariant failure: ${message}.");
}

function workWithUnsafeParam(param: unknown) {
  if (typeof param !== "string") {
    fail("param should be a string, not ${typeof param}");
  }

  // 여기에서 param의 타입은 string으로 알려집니다.
  param.toUpperCase(); // OK
}
```

## 5.5 함수 오버로드

일부 자바스크립트 함수는 선택적 매개변수와 나머지 매개변수만으로 표현할 수 없는 매우 다른 매개변수들로 호출될 수 있다. 이러한 함수는 **오버로드 시그니처**라고 불리는 타입스크립트 구문으로 설명 가능하다. 즉, 하나의 최종 **구현 시그니처**와 그 함수의 본문 앞에 서로 다른 버전의 함수 이름, 매개변수, 반환 타입을 어려번 선언한다.

타입스크립트를 컴파일해 자바스크립트로 출력하면 다른 타입 시스템 구문처럼 오버로드 시그니처도 지워진다.

### 5.5.1 호출 시그니처 호환성

오버로드된 함수의 구현에서 사용되는 구현 시그니처는 매개변수 타입과 반환 타입에 사용하는 것과 동일하다. 따라서 함수의 오버로드 시그니처에 있는 반환 타입과 각 매개변수는 구현 시그니처에 있는 동일한 인덱스의 매개변수에 할당할 수 있어야 한다.

```typescript
function format(data: string): string; // OK
function format(data: string, needle: string, haystack: string): string; // OK

function format(getData: () => string): string;
// Error: This overload signature is not compatible with its implementation signature.
```

## 5.6 마치며

이번 장에서는 타입스크립트에서 함수의 매개변수와 반환 타입을 유추하거나 명시적으로 선언하는 방법을 살펴봤습니다.
