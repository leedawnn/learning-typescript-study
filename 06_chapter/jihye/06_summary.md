# 06 배열

타입스크립트는 초기 배열에 어떤 데이터 타입이 있는지 기억하고, 배열이 해당 데이터 타입에서만 작동하도록 제한한다. 이런 방식으로 배열의 데이터 타입을 하나로 유지시킨다.

다음예제에서 타입스크립트는 warriors 배열이 초기에 string 타입의 값을 포함한다는 것을 알고 있으므로 이후 string 타입의 값 추가는 허용하지만 다른 데이터 타입 추가는 허용하지 않는다.

```typescript
const warriors = ["Artemisa", "Boudica"];

// OK: "Zenobia"의 타입은 string
warriors.push("Zenobia");

warrirors.push(true);
// Error: Argument of type "boolean" is not assignable to parameter of the type 'string'
```

## 6.1 배열 선언 타입

다른 변수 선언과 마찬가지로 배열을 저장하기 위한 변수는 초깃값이 필요하지 않다. 배열에 대한 타입 애너테이션은 배열의 요소 타입 다음에 []가 와야 한다.

```typescript
let arrayOfNumbers: number[];

arrayOfNumbers = [4, 8, 15, 16, 23, 42];
```

### 6.1.1 배열과 함수 타입

배열 타입은 함수 타입에 무엇이 있는지를 구별하는 괄호가 필요한 구문 컨테이너의 예이다. 괄호는 애너테이션의 어느 부분이 함수 반환 부분이고 어느 부분이 배열 타입 묶음인지를 나타내기 위해 사용한다.

```typescript
// 타입은 string 배열을 반환하는 함수
let createStrings: () => string[];

// 타입은 각각의 string을 반환하는 함수 배열
let stringCreators: (() => string)[];
```

### 6.1.2 유니언 타입 배열

유니언 타입으로 배열 타입을 사용할 때, 애너테이션의 어느 부분이 배열의 콘텐츠이고 어느 부분이 유니언 타입 묶음인지를 나타내기 위해 괄호를 사용해야 할 수도 있다.

```typescript
// 타입은 string 또는 number의 배열
let stringOrArrayOfNumbers: string | number[];

// 타입은 각각 number 또는 string의 요소인 배열
let arrayOfStringOrNumbers: (string | number)[];
```

즉, 배열의 요소 타입은 배열에 담긴 요소에 대한 모든 가능한 타입의 집합이다.

### 6.1.3 any 배열의 진화

초기에 빈 배열로 설정된 변수에서 타입 애너테이션을 포함하지 않으면 타입스크립트는 배열을 any[]로 취급하고 모든 콘텐츠를 받을 수 있다. 하지만 any 변수가 변경되는 것처럼 any[]배열이 변경되는 것도 타입 검사기가 갖는 장점을 무력화하기에 좋아하지 않는다.

```typescript
// 타입: any[]
let values = [];

// 타입: string[]
values.push("");

// 타입: (number | string)[]
values[0] = 0;
```

### 6.1.4 다차원 배열

```typescript
let arrayOfArraysOfNumbers: number[][];

arrayOfArraysOfNumbers = [
  [1, 2, 3],
  [2, 4, 6],
  [3, 6, 9],
];
```

2차원 배열은 원래의 타입을 가지며 끝에 []가 있고, 그 뒤에 []를 추가한다고 생각하면 쉽다.
다음 arrayOfArraysOfNumbers 배열은 number[][]타입이고 (number[])[]로 나타낼 수 있다.

```typescript
// 타입: number[][]
let arrayOfArraysOfNumbers: number[][];
```

## 6.2 배열 멤버

타입스크립트는 배열의 멤버를 찾아서 해당 배열의 타입 요소를 되돌려주는 전형적인 인덱스 기반 접근 방식을 이해하는 언어이다.

```typescript
const defers = ["Clarenza", "Dina"];

// 타입: string
const defender = defenders[0];
```

유니언 타입으로 된 배열의 멤버는 그 자체로 동일한 유니언 타입이다.

```typescript
const soldiersOrDates = ["Deborah Sampson", new Date(1782, 6, 3)];

// 타입: string | Date
const soldierOrDate = sodiersOrDate[0];
```

### 6.2.1 주의 상항: 불안정한 멤버

특히 배열은 타입 시스템에서 불안정한 소스이다. 기본적으로 타입스크립트는 모든 배열의 멤버에 대한 접근이 해당 배열의 멤버를 반환한다고 가정하지만, 자바스크립트에서조차도 배열의 길이보다 큰 인덱스로 배열 요소에 접근하면 undefined를 제공한다. 다음 코드는 타입스크립트 컴파일러의 기본 설정에서 오류를 표시하지 않는다.

```typescript
function withElements(elements: string[]) {
  console.log(elements[9001].length); // 타입 오류 없음
}

withElements(["It's", "over"]);
```

Cannot read property 'length' of undefined가 발생하며 충돌할 거라고 유추할 수 있지만, 타입스크립트는 검색된 배열의 멤버가 존재하는지 의도적으로 확인하지 않는다. elements[9001]은 undefined가 아니라 string으로 유추된다.

## 6.3 스프레드와 나머지 매개변수

...연산자를 사용하는 나머지 매개변수와 배열 스프레드는 자바스크립트에서 배열과 상호작용하는 핵심 방법이다. 타입스크립트는 두 방법을 모두 이해한다.

### 6.3.1 스프레드

...스프레드 연산자를 사용해 배열을 결합한다. 타입스크립트는 입력된 배열 중 하나의 값이 결과 배열에 포함될 것임을 이해한다.

만약에 입력된 배열의 타입이 동일하다면 출력 배열도 동일한 타입이다. 서로 다른 타입의 두 배열을 함께 스프레드해 새 배열을 생성하면 새 배열은 두 개의 원래 타입 중 어느 하나의 요소인 유니언 타입 배열로 이해된다.

```typescript
// 타입: string[]
const soldiers = ["Harriet Tubman", "Joan of Arc", "Khutulun"];

// 타입: number[]
const soldierAges = [90, 19, 45];

// 타입: (string | number)[]
const conjoined = [...soldiers, ...soldierAges];
```

### 6.3.2 나머지 매개변수 스프레드

타입스크립트는 나머지 매개변수로 배열을 스프레드하는 자바스크립트 실행을 인식하고 이에 대해 타입 검사를 수행한다. 나머지 매개변수를 위한 인수로 사용되는 배열은 나머지 매개변수와 동일한 배열 타입을 가져야 한다.

```typescript
function logWarriors(greeting: string, ...names: string[]) {
  for (const name of names) {
    console.log("${greetings}, ${name}!");
  }
}

const warriors = ["Cathy Williams", "Lozen", "Nzinga"];

logWarriors("Hello", ...warriors);

const birthYears = [1844, 1840, 1583];

logWarriors("Born in", ...birthYears);
// Error: Argument or type 'number' is not assignable to parameter or type 'string';
```

## 6.4 튜플

자바스크립트 배열은 이론상 어떤 크기라도 될 수 있다. 하지만 때로는 튜플이라고 하는 고정된 크기의 배열을 사용하는 것이 유용하다. 튜플 배열은 각 인덱스에 알려진 특정 타입을 가지며 배열의 모든 가능한 멤버를 갖는 유니언 타입보다 더 구체적이다. 튜플 타입을 선언하는 구문은 배열 리터럴처럼 보이지만 요소의 값 대신 타입을 적는다.

yearAndWarrior 배열은 인덱스 0에 number 타입 값을 갖고, 인텍스 1에 string 값을 갖는 튜플 타입으로 선언됐다.

```typescript
let yearAndWarrior: [number, string];

yearAndWarrior = [530, "Tomyris"]; // OK
// Error: Type 'boolean' is not assignable to type 'number'.

yearAndWarrior = [530];
// Error: Type '[number]' is not assignable to type '[number, string]'.
// Source has 1 element(s) but target requires 2.
```

### 6.4.1 튜플 할당 가능성

타입스크립트에서 튜플 타입은 가변 길이의 배열 타입보다 더 구체적으로 처리된다. 즉, 가변 길이의 배열 타입은 튜플 타입에 할당할 수 없다.

```typescript
// 타입: (boolean | number)[]
const pairLoose = [false, 123];

const pairTupleLoose: [boolean, number] = pairLoose;
// Error: Type '(number | boolean)[]' is not assignable to type '[boolean, number]'.
// Target requires 2 element(s) but source may have fewer.
```

타입스크립트는 튜플 타입의 튜플에 얼마나 많은 멤버가 있는지 알고 있기 때문에 길이가 다른 튜플은 서로 할당할 수 없다.

#### 나머지 매개변수로서의 튜플

튜플은 구체적인 길이와 요소 타입 정보를 가지는 배열로 간주되므로 함수에 전달할 인수를 저장하는 데 특히 유용하다.

다음 logPair 함수의 매개변수는 string과 number로 입력된다. (string | number)[] 타입의 값을 인수로 전달하려고 하면 둘 다 동일한 타입이거나 타입의 잘못된 순서로 인해 내영이 일치하지 않을 가능성이 있어 타입의 안전을 보장할 수 없다. 그러나 값이 [string, number] 튜플이라고 알고 있다면 값이 일치한다는 것을 알게 된다.

```typescript
function logPair(name: string, value: number) {
  console.log("${name} has ${value}");
}

const pairArray = ["Amege", 1];

logPair(...pairArray);
// Error: A spread argument must either have a tuple type or be passed to a rest parameter

const pairTupleIncorrect: [number, string] = [1, "Amege"];

logPair(...pairTupleIncorrect); // OK
```

### 6.4.2 튜플 추론

타입스크립트는 생성된 배열을 튜플이 아닌 가변 길이의 배열로 취급한다. 배열이 변수의 초깃값 또는 함수에 대한 반환값으로 사용되는 경우, 고정된 크기의 튜플이 아니라 유연한 크기의 배열로 가정한다.

```typescript
// 반환 타입: (string | number)[]
function firstCharAndSize(input: strig) {
  return [input(0), input.length];
}

// firstChar 타입: string | number
// size 타입: string | number
const [firstChar, size] = firstCharAndSize("Gudit");
```

#### 명시적 튜플 타입

함수에 대한 반환 타입 애너테이션처럼 튜플 타입도 타입 애너테이션에 사용할 수 있다. 함수가 튜플 타입을 반환한다고 선언되고, 배열 리터럴을 반환한다면 해당 배열 리터럴은 일반적인 가변 길이의 배열 대신 튜플로 간주된다.

#### const 어서선

명시적 타입 애너테이션에 튜플 타입을 입력하는 작업은 고통스러울 수 있다. 즉, 코드 변경에 따라 작성 및 수정이 필요한 구문을 추가해야 한다.

다음과 같이 배열 리터럴 뒤에 as const가 배치되면 배열이 튜플로 처리되어야 함을 나타낸다.

```typescript
// 타입: (string | number)[]
const unionArray = [1157, "Tomoe"];

// 타입: readonly [1157, "Tomoe"]
const readonlyTuple = [1157, "Tomoe"] as const;
```

const 어서션은 유연한 크기의 배열을 고정된 크기의 튜플로 전환하는 것을 넘어서, 해당 튜플이 읽기 전용이고 값 수정이 예상되는 곳에서 사용할 수 없음을 나타낸다.

```typescript
const pairMutable: [number, string] = [1157, "Tomoe"];
pairMutable[0] = 1247; // Ok

const pairAlsoMutable: [number, string] = [1157, "Tomoe"] as const;
// Error: The type 'readonly [1157, "Tomoe"] is 'readonly'
// and cannot be assigned to the mutable type '[number, string]'

const pairConst = [1157, "Tomoe"] as const;
pairConst[0] = 1247;
// Error: Cannot assign to '0' because it is a read-only property.
```

실제로 읽기 전용 튜플은 함수 반환에 편리하다. 튜플을 반환하는 함수로부터 반환된 값은 보통 즉시 구조화되지 않으므로 읽기 전용인 튜플은 함수를 사용하는 데 방해가 되지 않는다.

## 6.5 마치며

이번 장에서는 배열을 선언하고 배열에서 멤버를 찾는 법을 알아보았다.
