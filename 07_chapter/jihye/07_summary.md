# 07 인터페이스

인터페이스는 연관된 이름으로 객체 형태를 설명하는 또 다른 방법이다.

## 7.1 타입 별칭 vs. 인터페이스

다음은 born: number와 name: string을 가진 객체를 타입 별칭으로 구현하는 간략한 구문이다.

```typescript
type Poet = {
  born: number;
  name: string;
};
```

다음은 인터페이스로 구현한 동일한 구문이다.

```typescript
interface Poet {
  born: number;
  name: string;
}
```

인터페이스에 대한 타입스크립트의 할당 가능성 검사와 오류 메시지는 객체 타입에서 실행되는 것과 동일하다. 그러나 인터페이스와 타입 별칭 사이에는 몇 가지 주요 차이점이 있으며, 가능하다면 인터페이스 사용을 추천한다.

- 인터페이스는 속성 증가를 위해 병합할 수 있다.
- 인터페이스는 클래스가 선언된 구조의 타입을 확인하는 데 사용할 수 있지만 타입 별칭은 사용할 수 없다.
- 일반적으로 인터페이스에서 타입스크립트 타입 검사기가 더 빨리 작동한다.
- 인터페이스는 이름 없는 객체 리터럴의 별칭이 아닌 이름 있는(명명된) 객체로 간주되므로 어려운 특이 케이스에서 나타나는 오류 메시지를 좀 더 쉽게 읽을 수 있다.

## 7.2 속성 타입

자바스크립트 객체를 실제로 사용할 때 낯설고 이상할 수 있다. 타입스크립트는 인터페이스가 이런 이상판 부분을 모델링할 수 있도록 유용한 타입 시스템 도구를 제공한다.

### 7.2.1 선택적 속성

객체 타입과 마찬가지로 모든 객체가 필수적으로 인터페이스 속성을 가질 필요는 없다. 타입 애너테이션 : 앞에 ?를 사용해 인터페이스의 속성이 선택적 속성임을 나타낼 수 있다.

```typescript
interface Book {
    author?: string;
    pages: number;
}

// Ok
const ok: Book = {
    author: "Rita Dove",
    pages: 80,
};

const missing: Book {
    pages: 80
};
```

undefined를 포함한 유니언 타입의 선택적 속성과 일반 속성 사이의 차이점과 관련된 주의 사항은 객체 타입뿐만 아니라 인터페이스에도 적용된다.

### 7.2.2 읽기 전용 속성

경우에 따라 인터페이스에 정의된 객체의 속성을 재할당하지 못하도록 인터페이스 사용자를 차단하고 싶다. 타입스크립트는 속성 이름 앞에 readonly 키워드를 추가해 다른 값으로 설정될 수 없음을 나타낸다.

```typescript
interface Page {
  readonly text: string;
}

function read(page: Page) {
  consolg.log(page.text);

  page.text += "!";
  // Error: Cannot assign to 'text' because it is a read-only property.
}
```

readonly 제한자는 객체의 인터페이스를 선언하는 위치에서만 사용되고 실제 객체에는 적용되지 않는다.

Page 예제에서 text 속성의 부모 객체는 함수 내부에서 text로 명시적으로 사용되지 않았기 때문에 함수 밖에서 속성을 수정할 수 있다.

```typescript
const pageIsh = {
  text: "Hello, world!",
};

// Ok: pageIsh는 Page 객체가 아니라 text가 있는, 유추된 객체 타입입니다.
pageIsh.text += "!";

// Ok: pageIsh의 더 구체적인 버전인 Page를 읽습니다.
read(PageIsh);
```

명시적 타입 애너테이션인 : Page로 변수 pageIsh를 선언하면 타입스크립트에 text 속성이 readonly라고 가리키게 된다. 하지만 유추된 타입은 readonly가 아니었다.

readonly 인터페이스 멤버는 컴파일된 자바스크립트 출력 코드에는 존재하지 않는다.

### 7.2.3 함수와 메서드

타입스크립트에서도 인터페이스 멤버를 함수 타입으로 선언할 수 있다. 인터페이스 멤버를 함수로 선언하는 두 가지 방법이 있다.

- **메서드 구문**: 인터페이스 멤버를 member(): void와 같이 객체의 멤버로 호출되는 함수로 선언
- **속성 구문**: 인터페이스의 멤버를 member: () => void와 같이 독립 함수와 동일하게 선언

다음 코드의 method와 property 멤버는 둘 다 매개변수 없이 호출되어 string을 반환한다.

```typescript
interface HasBothFunctionTypes {
  property: () => string;
  method(): string;
}

const hasBoth: HasBothFunctionTypes = {
  property: () => "",
  mothod() {
    return "";
  },
};

hasBoth.property(); // Ok
hasBoth.method(); // Ok
```

두 가지 속성 모두 선택적 속성 키워드인 ?를 사용해 필수로 제공하지 않아도 되는 멤버로 나타낼 수 있다.

```typescript
interface OptionalReadonlyFunctions {
  optionalProperty?: () => string;
  optionalMethod?(): string;
}
```

책에서 다루는 메서드와 속성의 차이는 다음과 같다.

- 메서드는 readonly로 선언할 수 없지만 속성은 가능하다.
- 이번장 후반부에서 살펴볼 인터페이스 병합은 메서드와 속성을 다르게 처리한다.
- 타입에서 수행되는 일부 작업은 메서드와 속성을 다르게 처리한다.

현시점에서 추천하는 스타일 가이드는 다음과 같다.

- 기본함수가 this를 참조할 수 있다는 것을 알고 있다면 메서드 함수를 사용해라. 가장 일반적으로 클래스의 인스턴스에서 사용된다.
- 반대의 경우에는 속성 함수를 사용해라.

### 7.2.4 호출 시그니처

호출 시그니처는 값을 함수처럼 호출하는 방식에 대한 타입 시스템의 설명이다. 즉, 할당 가능한 매개변수와 반환 타입을 가진 함수다. 호출 시그니처는 함수 타입과 비슷하지만, 콜론(:) 대신 화살표(=>)로 표시한다.

```typescript
type FunctionAlias = (input: string) => number;

interface CallSignature {
  (input: string): number;
}

// 타입: (input: string) => number
const typedFunctionAlias: FunctionAlias = (input) => input.length; // Ok

// 타입: (input: string) => number
const typedCallSignature: CallSignature = (input) => input.length; // Ok
```

호출 시그니처는 사용자 정의 속성을 추가로 갖는 함수를 설명하는 데 사용할 수 있다.

### 7.2.5 인덱스 시그니처

타입스크립트는 인덱스 시그니처 구문을 제공해 인터페이스의 객체가 임의의 키를 받고, 해당 키 아래의 특정 타입을 반환할 수 있음을 나타낸다. 인덱스 시그니처는 일반 속성 정의와 유사하지만 키 다음에 타입이 있고 {[i: string]: ... }과 같이 배열의 대괄호를 갖는다.

```typescript
interface WordCounts {
  [i: string]: number;
}

const counts: WordCounts = {};

counts.apple = 0; // Ok
counts.banana = 1; // Ok

counts.cherry = false;
// Error: Type 'boolean' is not assignable to type 'number'.
```

인덱스 시그니처는 객체에 값을 할당할 때 편리하지만 타입 안정성을 완벽하게 보장하지는 않는다. 인덱스 시그니처는 객체가 어떤 속성에 접근하든 간에 값을 반환해야 함을 나타낸다.

다음 publishDates 값은 Date 타입으로 Frankenstein을 안전하게 반환하지만 타입스크립트는 Beloved가 정의되지 않았음에도 정의되었다고 생각하도록 속인다.

```typescript
interface DatesByName {
  [i: string]: Date;
}

const publishDates: DatesByName = {
  Frankenstein: new Date("1 January 1818"),
};

publishDates.Frankenstein; // 타입: Date
console.log(publishDates.Frankenstein.toString()); // Ok

publishDates.Beloved; // 타입은 Date이지만 런타임 값은 undefined
console.log(publishDates.Beloved.toString());
// 타입 시스템에서는 오류가 나지 않지만 실제 런타임에서는 오류가 발생함
// Runtime error: Cannot read property 'toString'
// of undefined (reading publishDates.Beloved)
```

키/값 쌍을 저장하려고 하는데 키를 미리 알 수 없다면 Map을 사용하는 편이 더 안전하다.

#### 속성과 인덱스 시그니처 혼합

인터페이스는 명시적으로 명명된 속성과 포괄적인 용도의 string 인덱스 시그니처를 한 번에 포함할 수 있다.

```typescript
interface HistoricalNovels {
  Oroonoko: number;
  [i: string]: number;
}

// Ok
const novels: HistoricalNovels = {
  Outlander: 1991,
  Oroonoko: 1688,
};

const missingOroonoko: HistoricalNovels = {
  // Error: Property 'Oroonoko' is missing in type
  // '{ Outlander: number; }' but required in type 'HistoricalNovels'.
  Outlander: 1991,
};
```

속성과 인덱스 시그니처를 혼합해서 사용하는 일반적인 타입 시스템 기법 중 하나는 인덱스 시그니처의 원시 속성보다 명명된 속성에 대해 더 구체적인 속성 타입 리터럴을 사용하는 것이다.

#### 숫자 인덱스 시그니처

타입스크립트 인덱스 시그니처 키로 string 대신 number 타입을 사용할 수 있지만, 명명된 속성은 그 타입을 포괄적인 용도의 string 인덱스 시그니처의 타입으로 할당할 수 있어야 한다.

### 7.2.6 중첩 인터페이스

객체 타입이 다른 객체 타입의 속성으로 중첩될 수 있는 것처럼 인터페이스 타입도 자체 인터페이스 타입 혹은 객체 타입을 속성으로 가질 수 있다.

## 7.3 인터페이스 확장

타입스크립트는 인터페이스가 다른 인터페이스의 모든 멤버를 복사해서 선언할 수 있는 **확장된** 인터페이스를 허용한다. 확장할 이터페이스의 이름 뒤에 extends 키워드를 추가해서 다른 인터페이스를 확장한 인터페이스라는 걸 표시한다.

```typescript
interface Writing {
  title: string;
}

interface Novella extends Writing {
  pages: number;
}

let myNovella: Novella = {
  pages: 195,
  title: "Ethan Frome",
};
```

### 7.3.1 재정의된 속성

파생 인터페이스는 다른 타입으로 속성을 다시 선언해 기본 인터페이스의 속성을 재정의하거나 대체할 수 있다.

### 7.3.2 다중 인터페이스 확장

타입스크립트의 인터페이스는 여러 개의 다른 인터페이스를 확장해서 선언할 수 있다. 파생 인터페이스 이름에 있는 extends 키워드 뒤에 쉼표로 인터페이스 이름을 구분해 사용하면 된다. 파생 인터페이스는 모든 기본 인터페이스의 멤버를 받는다.

## 7.4 인터페이스 병합

인터페이스의 중요한 특징 중 하나는 서로 병합하는 능력이다. 두 개의 인터페이스가 동일한 이름으로 동일한 스코프에 선언된 경우, 선언된 모든 필드를 포함하는 더 큰 인터페이스가 코드에 추가된다.

```typescript
interface Merged {
  fromFirst: string;
}

interface Merged {
  fromSecond: number;
}

// 다음과 같음:
// interface Merged {
//    fromFirst: string;
//    fromSecond: number;
//}
```

인터페이스가 여러 곳에 선언되면 코드 이해가 어려우므로 인터페이스 병합을 사용하지 않는 것이 좋다. 그러나 인터페이스 병합은 외부 패키지 또는 Window 같은 내장된 전역 인터페이스를 보강하는 데 특히 유용하다.

### 7.4.1 이름이 충돌되는 멤버

병합된 인터페이스는 타입이 다른 동일한 이름의 속성을 여러 번 선언할 수 없다. 속성이 이미 인터페이스에 선언되어 있다면 나중에 병합된 인터페이스에서도 동일한 타입을 사용해야 한다.

그러나 병합된 인터페이스는 동일한 이름과 다른 시그니처를 가진 메서드는 정의할 수 있다. 이렇게 하면 메서드에 대한 함수 오버로드가 발생한다.

```typescript
interface MergeMethods {
  different(input: string): string;
}

interface MergeMethods {
  different(input: number): string; // Ok
}
```

## 7.5 마치며

이번 장에서는 객체 타입을 인터페이스로 설명하는 방법을 소개했다.
