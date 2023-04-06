# Chapter 09

## 타입 제한자

### 9.1 top 타입

타입스크립트에서 `never`는 없는 값의 집합이다. 타입스크립트 이전에 인기가 있었던 flow에서는, 이와 동일한 역할을 하는 empty라고 하는 것이 존재한다.

이 집합에는 값이 없기 때문에, `never`은 어떠한 값도 가질 수 없으며, 여기에는 any 타입에 해당하는 값들도 포함된다. 이러한 특징 때문에, never 는 `uninhabitable type`, `bottom type` 이라고도 불린다.

당연히 그 반대 개념도 타입 이론에 존재한다.

**top type은 시스템에서 가능한 모든 값을 나타내는 타입이다. 모든 다른 타입의 값은 타입이 top인 위치에 제공될 수 있다. 즉, 모든 타입은 top 타입에 할당할 수 있다.**

### 9.1.1 any 다시보기

다만 any는 타입스크립트의 타입 검사기를 빠르게 건너뛰려고 할 때 유용하지만, 타입 검사를 비활성화하면 해당 값에 대한 타입스크립트의 유용성이 줄어든다.

**어떤 값이든 될 수 있음을 나타내려면 `unknown` 타입이 훨씬 안전하다.**

### 9.1.2 unknown

**타입스크립트에서 `unknown` 타입은 진정한 top 타입이다.** 모든 객체를 unknown 타입의 위치로 전달할 수 있다는 점에서 any 타입과 유사하지만, **unknown 타입은 값을 훨씬 더 제한적으로 취급한다.**

- **타입스크립트는 unknown 타입 값의 속성에 직접 접근할 수 없다.**
- **unknown 타입은 top 타입이 아닌 타입에는 할당할 수 없다.**

```typescript
function greetComedian(name: unknown) {
  console.log(`Announcing ${name.toUpperCase()}!`);
  // Error: Object is of type 'unknown'.
}
```

**unknown 타입 값의 속성에 접근하려고 시도하면 타입 오류가 난다.** ~~이래서 오류났던 거구나.....~~

**타입스크립트가 unknown 타입인 name에 접근할 수 있는 유일한 방법은 `instainceof`나 `typeof` 또는 타입 어설션을 사용하는 것처럼 값의 타입이 제한된 경우다**.

```typescript
function greetingComedianSafety(name: unknown) {
  if (typeof value === 'string') {
    console.log(`Announcing ${name.toUpperCase()}!`); // Ok
  } else {
    console.log("Well, I'm off.");
  }
}

greetingComedianSafety('Betty White'); // Logs: 4
greetingComedianSafety({}); // 로그 없음
```

위의 코드는 `typeof`를 사용하여 타입을 좁혔다.

**앞서 얘기한 unknown 타입 값의 두 가지 제한으로 인해 unknown이 any보다 훨씬 안전한 타입으로 사용된다. 가능하다면 any 대신 unknown을 사용하길 추천한다.**

### 9.2 타입 서술어

`instainceof`, `typeof`와 같은 자바스크립트 구문을 사용해 타입을 좁히는 방법은 제한된 검사로 이 방법을 직접 사용할 때는 괜찮지만, 로직을 함수로 감싸면 타입을 좁힐 수 없게 된다.

```typescript
function isNumberOrString(value: unknown) {
  return ['number', 'string'].includes(typeof value);
}

function logValueIfExists(value: number | string | null | undefined) {
  if (isNumberOrString(value)) {
    // Value: number | string | null | undefined의 타입
    value.toString();
    // Error: Object is possibly undefined.
  } else {
    console.log('Value does not exist: ', value);
  }
}
```

예를 들어 위의 isNumberOrString 함수는 value를 받고 그 값이 number 또는 string인지를 나타내는 boolean 값을 반환한다. 우리는 `isNumberOrString(value)`가 true를 반환하므로 if문 내부의 값이 두 가지 타입 중 하나여야 한다고 유추할 수 있지만 타입스크립트는 그렇지 않다. 타입스크립트는 isNumberOrString이 boolean 값을 반환한다는 사실만 알 수 있고, 인수의 타입을 좁히기 위함이라는 건 알 수 없다.

그래서 인수가 특정 타입인지 여부를 나타내기 위해 boolean 값을 반환하는 함수를 위한 특별한 구문이 있다. 이를 **타입 서술어(type predicate)** 라고 부르며 '**사용자 정의 타입 가드**'라고도 부른다.

```typescript
function typePredicate(input: WideType): input is NarrowType;
```

**타입 서술어는 일반적으로 매개변수로 전달된 인수가 매개변수의 타입보다 더 구체적인 타입인지 여부를 나타내는 데 사용된다. 타입 서술어의 반환 타입은 매개변수의 이름, is 키워드, 특정 타입으로 선언할 수 있다.**

```typescript
function isNumberOrString(value: unknown): value is number | string {
  return ['number', 'string'].includes(typeof value);
}

function logValueIfExists(value: number | string | null | undefined) {
  if (isNumberOrString(value)) {
    // value: number | string의 타입
    value.toString(); // Ok
  } else {
    // value: null | undefined의 타입
    console.log('value does not exist: ', value);
  }
}
```

**이전 예제의 isNumberOrString 함수에서 value를 `is number | string`으로 명시적으로 변경하면 명시적 반환 타입을 가질 수 있다. 그러면 타입스크립트는 value가 `number | string` 타입의 값을 가져야 한다고 추론한다.**

타입 서술어는 이미 한 인터페이스의 인스턴스로 알려진 객체가 더 구체적인 인터페이스의 인스턴스인지 여부를 검사하는 데 자주 사용된다.

```typescript
interface Comedian {
  funny: boolean;
}

interface StandupComedian extends Comedian {
  routine: string;
}

function isStandupComedian(value: Comedian): value is StandupComedian {
  return 'routine' in value;
}

function workWithComedian(value: Comedian) {
  if (isStandupComedian(value)) {
    console.log(value.routine); // Ok
  }

  console.log(value.routine);
}
```

위의 코드를 보면 StandupComedian 인터페이스는 Comedian 인터페이스 위에 추가 정보를 갖는다. isStandupComedian 타입 가드는 Comedian이 구체적으로 StandupComedian인지 여부를 확인하는데 사용된다.

타입 서술어는 false 조건에서 타입을 좁히기 때문에 타입 서술어가 입력된 타입 이상을 검사하는 경우 예상치 못한 결과를 얻을 수 있음을 주의해야한다.

```typescript
function isLongString(input: string | undefined): input is string {
  return !!(input && input.length >= 7);
}

function workWithText(text: string | undefined) {
  if (isLongString(text)) {
    console.log('Long text: ', text.length);
  } else {
    console.log('Short text: ', text?.length);
    // Error: Property 'length' does not exist on type 'never'.
  }
}
```

위의 isLongString 타입 서술어는 input 매개변수가 undefined 또는 길이가 7보다 작은 string인 경우 false를 반환한다. 결과적으로 else문(false 조건)은 text를 undefined 타입으로 좁힌다.

하지만 타입 서술어는 속성이나 값의 타입을 확인하는 것 이상을 수행해 잘못 사용하기 쉬우므로 가능하면 피하는 것이 좋다. 대부분은 간단한 타입 서술어만으로도 충분하다.

### 9.3 타입 연산자

키워드나 기존 타입의 이름만 사용해 모든 타입을 나타낼 수는 없다. 때로는 기존 타입의 속성 일부를 변환해서 두 타입을 결합하는 새로운 타입을 생성해야할 때도 있다.

### 9.3.1 keyof

자바스크립트 객체는 일반적으로 string 타입인 동적값을 사용하여 검색된 멤버를 갖는다. 타입 시스템에서 이러한 키를 표현하려면 상당히 까다로울 수 있다. string 같은 포괄적인 원시 타입을 사용하면 컨테이너 값에 대해 유효하지 않은 키가 허용된다.

```typescript
interface Ratings {
  audience: number;
  critics: number;
}

function getRating(ratings: Ratings, key: string): number {
  return ratings[key];
  /* Error: Element implicitly has an 'any' type because expression of type 'string' can't be used to index type 'Ratings'.
  No index signature with a parameter of type 'string' was found on type 'Ratings'. */
}

const ratings: Ratings = { audience: 66, critic: 84 };

getRating(ratings, 'audience'); // Ok

getRating(ratings, 'not valid'); // 허용되지만 사용하면 안됨
```

타입 string은 Ratings 인터페이스에서 속성으로 허용되지 않는 값을 허용하고, Ratings는 string 키를 허용하는 인덱스 시그니처를 선언하지 않는다.

인터페이스에 수십 개 이상의 멤버가 있다면 어떻게 될까? 각 멤버의 키를 유니언 타입에 모두 입력하고 최신 상태를 유지해야 하는 상당히 번거로운 작업이 필요할 것이다.

**대신 타입스크립트에서는 기존에 존재하는 타입을 사용하고, 해당 타입에 허용되는 모든 키의 조합을 반환하는 `keyof` 연산자를 제공한다. 타입 애너테이션처럼 타입을 사용하는 모든 곳에서 타입 이름 앞에 `keyof` 연산자를 배치한다.**

keyof는 존재하는 타입의 키를 바탕으로 유니언 타입을 생성하는 훌륭한 기능이다.

### 9.3.2 typeof

타입스크립트에서 제공하는 또 다른 타입 연산자는 `typeof`이다. `typeof`는 제공되는 값의 타입을 반환한다.

```typescript
const original = {
  medium: 'movie',
  title: 'Mean Girls',
};

let adaptation: typeof original;

if (Math.random() > 0.5) {
  adaptation = { ...original, medium: 'play' }; // Ok
} else {
  adaptation = { ...original, medium: 2 };
  // Error: Type 'number' is not assignable to type 'string'.
}
```

`typeof` 타입 연산자는 시각적으로 주어진 값이 어떤 타입인지 반환할 때 사용하는 런타임 연산자처럼 보이지만 아니다. 둘은 단지 우연히 같은 단어를 사용할 뿐이다.

**타입스크립트의 `typeof`연산자는 타입스크립트에서만 사용할 수 있으며 컴파일된 잡사크르비트 코드에는 나타나지 않는다.**

#### keyof typeof

`typeof`는 값의 타입을 검색하고, `keyof`는 타입에 허용된 키를 검색한다. 두 키워드를 함께 연결해 값의 타입에 허용된 키를 간결하게 검색할 수 있다.

```typescript
const ratings = {
  imdb: 8.4,
  metacritic: 82,
};

function logRating(key: keyof typeof ratings) {
  console.log(ratings[key]);
}

logRating('imdb'); // Ok

logRating('invalid');
// Error: Argument of type '"missing"' is not assignable to parameter of type '"imdb" | "metacritic"'.
```

위의 코드에서 logRating 함수는 ratings 값의 키 중 하나를 받는다. 코드는 인터페이스를 생성하는 것 대신, `keyof typeof`를 사용해 키가 ratings 값 타입의 키 중 하나여야 함을 나타낸다.

`keyof`와 `typeof`를 결합해서 사용하면 명시적 인터페이스 타입이 없는 객체에 허용된 키를 나타내는 타입에 대한 코드를 작성하고 업데이트하는 수고를 줄일 수 있다.

### 9.4 타입 어서션

타입스크립트는 코드가 **강력하게 타입화**될 때 가장 잘 작동한다. 그러나 경우에 따라서는 코드가 어떻게 작동하는지 타입 시스템에 100% 정확하게 알리는 것이 불가능할 때도 있다.

예를 들어 `JSON.parse`는 의도적으로 top 타입인 any를 반환한다. `JSON.parse`에 주어진 특정 문자열값이 특정한 값 타입을 반환해야 한다는 것을 타입 시스템에 안전하게 알릴 수 있는 방법은 없다.

타입스크립트는 타입 어서션(type assertion)을 제공한다. 다른 타입을 의미하는 값의 타입 다음에 `as` 키워드를 배치한다. 타입 시스템은 어서션을 따르고 값을 해당 타입으로 처리한다.

```typescript
const rawData = '["grace", "frankie"]';

// 타입: any
JSON.parse(rawData);

// 타입: string[]
JSON.parse(rawData) as string[];

// 타입: [string, string]
JSON.parse(rawData) as [string, string];

// 타입: ["grace", "frankie"]
JSON.parse(rawData) as ['grace', 'frankie'];
```

타입 어서션은 자바스크립트로 컴파일될 때 다른 타입 시스템 구문과 함께 제거된다.

> **note** : 이전 라이브러리나 코드로 작업하는 경우 `item as type` 대신 `<type>item` 같은 캐스팅 구문을 볼 수 있다. 이 구문은 jsx 구문과 호환되지 않고 .tsx파일에서도 작동하지 않기 때문에 권장하지 않는다.

**타입스크립트 모범 사례는 가능한 한 타입 어서션을 사용하지 않는 것이다.** 코드가 완전히 타입화되고 어서션을 사용해 타입스크립트의 타입 이해를 방해할 필요가 없는 것이 가장 좋다. 그러나 타입 어서션이 유용하고 심지어 필요한 경우가 종종 있다.

### 9.4.1 포착된 오류 타입 어서션

오류를 처리할 때 타입 어서션이 매우 유용할 수 있다. try 블록의 코드가 예상과 다른 객체를 예기치 않게 발생할 수 있기 때문에 catch 블록에서 포착된 오류가 어떤 타입인지 아는 것은 일반적으로 불가능하다.

```typescript
try {
  // 오류를 발생시키는 코드
} catch (error) {
  console.warn('Oh no!', (error as Error).message);
}
```

위의 코드는 Error 클래스의 인스턴스라고 가정된 error의 message 속성에 접근한다.

**발생된 오류가 예상된 오류 타입인지를 확인하기 위해 `instanceof` 검사와 같은 타입 내로잉을 사용하는 것이 더 안전하다.**

```typescript
try {
  // 오류를 발생시키는 코드
} catch (error) {
  console.warn('Oh no!', error instanceof Error ? error.message : error);
}
```

### 9.4.2 non-null 어서션

**`null` 또는 `undefined`를 포함할 수 있는 변수에서 `null`과 `undefined`를 제거할 때 타입 어서션을 주로 사용한다. `!`를 사용하면 된다. 즉, non-null 어서션은 타입이 null 또는 undefined가 아니라고 간주한다.**

```typescript
// 타입 유추: Date | undefined
let maybeDate = Math.random() > 0.5 ? undefined : new Date();

// 타입이 Date라고 간주됨
maybeDate as Date;

// 타입이 Date라고 간주됨
maybeDate!;
```

아래 코드에 나오는 Map 객체는 객체의 프로퍼티를 자주 변경할 때 유용하다.

> 참고하기: https://maxkim-j.github.io/posts/js-map/

```typescript
const seasonCounts = new Map([
  ['I Love Lucy', 6],
  ['The Golden Girls', 7],
]);

// 타입: string | undefined
const maybeValue = seasonCounts.get('I Love Lucy');

console.log(maybeValue.toUpperCase());
// Error: Object is possibly 'undefined'.

// 타입: string
const knownValue = seasonCounts.get('I Love Lucy')!;

console.log(knownValue.toUpperCase()); // Ok
```

위의 코드에서 seasonCounts는 일반적인 `Map<string, number>`이다. seasonCounts는 'I Love Lucy' 키를 포함하고 있으므로 knownValue 변수는 `!`를 사용해 해당 타입에서 `| undefined`를 제거할 수 있다.

### 9.4.3 타입 어서션 주의 사항

**any 타입과 마찬가지로 타입 어서션은 하나의 도피 수단이다. 따라서 any 타입을 사용할 때처럼 꼭 필요한 경우가 아니라면 가능한 한 사용하지 말아야한다.**

```typescript
const seasonCounts = new Map([
  ['Board City', 5],
  ['Community', 6],
]);

// 타입: string
const knownValue = seasonCounts.get('I Love Lucy')!;

console.log(knownValue.toUpperCase()); // 타입 오류는 아니지만, 런타임 오류가 발생함
// Runtime TypeError: Cannot read property 'toUpperCase' of undefined.
```

타입 어서션은 자주 사용하면 안 되고, 사용하는 것이 안전하다고 확실히 확신할 때만 사용해야한다.

#### 어서션 vs 선언

변수 타입을 선언하기 위해 타입 애너테이션을 사용하는 것과 초깃값으로 변수 타입을 변경하기 위해 타입 어서션을 사용하는 것 사이에는 차이가 있다.

**변수의 타입 애너테이션에 대한 변수의 초깃값에 대해 할당 가능성 검사를 수행한다. 그러나 타입 어서션은 타입스크립트에 타입 검사 중 일부를 건너뛰도록 명시적으로 지시한다.**

```typescript
interface Entertainer {
  acts: string[];
  name: string;
}

const declared: Entertainer = {
  // Error: Propery 'acts' is missing in type '{ one: number; }' but required in type 'Entertainer'.
  name: 'Moms Mabley',
};

const asserted = {
  name: 'Moms Mabley',
} as Entertainer; // 허용되지만 런타임 시 오류 발생

// 다음 구문은 런타임 시 다음 오류로 인해 정상적으로 작동되지 않음
// Runtime TypeError: Cannot read properties of undefined (reading 'toPrecision')
console.log(declared.acts.join(', '));
console.log(asserted.acts.join(', '));
```

**따라서 타입 애너테이션을 사용하거나 타입스크립트가 초깃값에서 변수의 타입을 유추하도록 하는 것이 매우 바람직하다.**

#### 어서션 할당 가능성

타입스크립트는 타입 중 하나가 다른 타입에 할당 가능한 경우에만 두 타입간의 타입 어서션을 허용한다. 완전히 서로 관련히 없는 두 타입 사이에 타입 어서션이 있을 경우에는 타입 오류를 낸다.

```typescript
let myValue = 'Stella!' as number;
```

하나의 타입에서 값을 완전히 관련 없는 타입으로 전환해야 하는 경우 이중 타입 어서션(double type assertion)을 사용한다. 먼저 값을 any나 unknown 같은 top 타입으로 전환한 다음, 그 결과를 관련 없는 타입으로 전환한다.

```typescript
let myValueDouble = '1337' as unknown as number; // 허용되지만 이렇게 사용하면 안됨
```

### 9.5 const 어서션

6장에서 가변적인 배열 타입을 읽기 전용 튜플 타입으로 변경하는 `as const` 구문을 소개했다.

`const 어서션`은 배열, 원시 타입, 값, 별칭 등 모든 값을 상수로 취급해야 함을 나타내는 데 사용한다. 특히 `as const`는 수신하는 모든 타입에 다음 세 가지 규칙을 적용한다.

- 배열은 가변 배열이 아니라 읽기 전용 튜플로 취급된다.
- 리터럴은 일반적인 원시 타입과 동등하지 않고 리터럴로 취급된다.
- 객체의 속성은 읽기 전용으로 간주된다.

### 9.5.1 리터럴에서 원시 타입으로

타입 시스템이 리터럴 값을 일반적인 원시 타입으로 확장하기보다 특정 리터럴로 이해하는 것이 유용할 수 있다.

```typescript
// 타입: () => string
const getName = () => 'Maria Bamford';

// 타입: () => 'Maria Bamford'
const getNameConst = () => 'Maria Bamford' as const;
```

위의 코드를 보면 getName의 반환 타입은 일반적인 string 대신 'Maria Bamford'라는 구체적인 값이다.

값의 특정 필드가 더 구체적인 리터럴 값을 갖도록 하는 것도 유용하다. 많은 인기있는 라이브러리는 값의 판별 필드가 특정 리터럴이 되도록 요구한다. 따라서 해당 코드의 타입이 값을 더 구체적으로 추론할 수 있다.

```typescript
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
/* '{ quote: string; style: string; }' 형식의 인수는 'Joke' 형식의 매개 변수에 할당될 수 없습니다.
  'style' 속성의 형식이 호환되지 않습니다.
    'string' 형식은 '"story" | "one-liner"' 형식에 할당할 수 없습니다. ts(2345)
*/
```

### 9.5.2 읽기 전용 객체

`as const`를 사용해 값 리터럴을 어서션하면 유추된 타입이 가능한 한 구체적으로 전환된다. 모든 멤버 속성은 `readonly`가 되고, 리터럴은 일반적인 원시 타입 대신 고유한 리터럴 타입으로 간주되며, 배열은 읽기 전용 튜플이 된다. 즉, 값 리터럴에 const 어서션을 적용하면 해당 값 리터럴이 변경되지 않고 모든 멤버에 동일한 const 어서션 로직이 재귀적으로 적용된다.

```typescript
function describePreference(preference: 'maybe' | 'no' | 'yes') {
  switch (preference) {
    case 'maybe':
      return 'I suppose...';
    case 'no':
      return 'No thanks.';
    case 'yes':
      return 'Yes please!';
  }
}

// 타입: { movie: string, standup: string }
const preferencesMutable = {
  movie: 'maybe',
  standup: 'yes',
};

describePreference(preferencesMutable.movie);
// Error: Argument of type 'string' is not assignable to parameter of type '"maybe" | "no" | "yes"'.

preferencesMutable.movie = 'no'; // Ok

// 타입: readonly { readonly movie: 'maybe', readonly standup: 'yes' }
const preferencesReadonly = {
  movie: 'maybe',
  standup: 'yes',
} as const;

describePreference(preferencesReadonly.movie); // Ok

preferencesReadonly.movie = 'no';
// Error: Cannot assign to 'movie' because it is a read-only property.
```
