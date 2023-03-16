# Chapter 04

## 객체

이번 장에서는 복잡한 객체 형태를 설명하는 방법과 타입스크립트가 객체의 할당 가능성을 확인하는 방법에 대해 알아보자.

### 4.1 객체 타입

객체에서 값의 속성에 접근하려면 `value.멤버` 또는 `value['멤버']` 구문을 사용한다.

객체 타입은 타입스크립트가 자바스크립트 코드를 이해하는 방법에 대한 핵심 개념이다. `null`과 `undefined`를 제외한 모든 값은 그 값에 대한 실제 타입의 멤버 집합을 가지므로 타입스크립트는 모든 값의 타입을 확인하기 위해 객체 타입을 이해해야한다.

### 4.1.1 객체 타입 선언

객체 타입은 객체 리터럴과 유사하게 보이지만 필드 값 대신 타입을 사용해 설명한다.

```typescript
let poetlater: {
  born: number;
  name: string;
};

// Ok
poetLater = {
  born: 1935,
  name: 'Mary Oliver',
};

poetLater = 'Sappho';
// Error: Type 'string' is not assignable to type '{ born: number; name: string; }'
```

타입스크립트는 할당 가능성에 대한 오류메세지를 표시한다.

### 4.1.2 별칭 객체 타입

`{ born: number, name: string }`과 같은 객체 타입을 계속 작성하는 것은 매우 귀찮다. 따라서 각 객체 타입에 **타입 별칭**을 할당하여 사용하는 방법이 더 일반적이다.

타입 별칭을 할당하면 타입스크립트의 할당 가능성 오류 메시지를 좀 더 직접적으로 읽기 쉽게 만드는 이점이 있다.

```typescript
type Poet = {
  born: number;
  name: string;
};

let poetLater: Poet;

// Ok
poetLater = {
  born: 1935,
  name: 'Sara Teasdale',
};

poetLater = 'Emily Dickinson';
// Error: Type 'string' is not assignable to 'Poet'.
```

### 4.2 구조적 타이핑

타입스크립트의 타입 시스템은 **구조적으로 타입화(structurally typed)** 되어 있다. 즉, 타입을 충족하는 모든 값을 해당 타입의 값으로 사용할 수 있다. 다시 말하자면 매개변수나 변수가 특정 객체 타입으로 선언되면 타입스크립트에 어떤 객체를 사용하든 해당 속성이 있어야 한다고 말해야한다.

```typescript
type WithFirstName = {
  firstName: string;
};

type WithLastName = {
  lastName: string;
};

const hasBoth = {
  firstName: 'Lucille',
  lastName: 'Clifton',
};

// Ok: 'hasBoth'는 'string' 타입의 'firstName'을 포함함
let withFirstName: WithFirstName = hasBoth;

// Ok: 'hasBoth'는 'string' 타입의 'lastName'을 포함함
let withLastName: WithLastName = hasBoth;
```

구조적 타이핑은 **덕 타이핑(duck typing)** 과는 다르다. 덕 타이핑은 '오리처럼 보이고 오리처럼 꽥꽥거리면, 오리일 것이다'라는 문구에서 유래했다.

- 타입스크립트의 타입 검사기에서 구조적 타이핑은 정적 시스템이 타입을 검사하는 경우이다.
- 덕 타이핑은 런타임에서 사용될 때까지 객체 타입을 검사하지 않는 것을 말한다.

**요약하면 자바스크립트는 덕 타입인 반면 타입스크립트는 구조적 타이핑이다.**

### 4.2.1 사용 검사

객체 타입에 필요한 멤버가 객체에 없다면 타입스크립트는 타입 오류를 발생시킨다. 또한, 객체의 속성이 일치하지 않으면 타입 오류를 발생시킨다.

### 4.2.2 초과 속성 검사

변수가 객체 타입으로 선언되고, 초깃값에 객체 타입에서 정의된 것보다 많은 필드가 있다면 타입 오류가 발생한다. 따라서 변수를 객체 타입으로 선언하는 것은 타입 검사기가 해당 타입에 예상되는 필드만 있는지 확인하는 방법이기도 하다.

초과 속성 검사는 객체 타입으로 선언된 위치에서 생성되는 객체 리터럴에 대해서만 일어난다. 기존 객체 리터럴을 제공하면 초과 속성 검사를 우회한다.

```typescript
type Color = {
  name: string;
  id: number;
};

const yellow = {
  name: 'yellow',
  id: 2,
  hex: '#FFFF00',
};

const hexYellow: Color = yellow; // Ok

const hexYellow: Color = {
  name: 'yellow',
  id: 2,
  hex: '#FFFF00',
  // Error: '{ name: string; id: number; hex: string; }' 형식은 'Color' 형식에 할당할 수 없습니다. 개체 리터럴은 알려진 속성만 지정할 수 있으며 'Color' 형식에 'hex'이(가) 없습니다.
};
```

**타입스크립트에서 초과 속성을 금지하면 코드를 깨끗하게 유지할 수 있고, 예상한 대로 작동하도록 만들수 있다.** 객체 타입에 선언되지 않은 초과 속성은 종종 잘못 입력된 속성 이름이거나 사용되지 않는 코드일 수 있다.

### 4.2.4 중첩된 객체 타입

자바스크립트 객체는 다른 객체의 멤버로 중첩될 수 있으므로 타입스크립트의 객체 타입도 타입 시스템에서 중첩된 객체 타입을 나타낼 수 있어야한다. 이를 구현하는 구문은 `{...}` 객체 타입을 사용한다.

**중첩된 타입을 자체 타입 별칭으로 추출하면 타입스크립트의 타입 오류 메시지에 더 많은 정보를 담을 수 있다. (가독성도 좋아지고 오류 메시지도 읽기 쉬워짐)**

### 4.2.4 선택적 속성

모든 객체에 객체 타입 속성이 필요한 건 아니다. 타입의 속성 애너테이션에서 `:` 앞에 `?`를 추가하면 선택적 속성임을 나타낼 수 있다.

```typescript
type Book = {
  author?: string;
  pages: number;
};

// Ok
const ok: Book = {
  author: 'Rita Dove',
  pages: 80,
};

const missing: Book = {
  author: 'Rita Dove',
  // Error: Property 'pages' is missing in type
  // '{ pages: number; }' but required in type 'Book'.
};
```

선택적 속성과 `undefined`를 포함한 유니언 타입의 속성 사이에는 차이가 있음을 명심하자. `?`를 사용해 선택적으로 선언된 속성은 존재하지 않아도 된다. 필수로 선언된 속성과 `| undefined`는 그 값이 `undefined`일지라도 반드시 존재해야한다.

### 4.3 객체 타입 유니언

타입스크립트에서는 하나 이상의 서로 다른 객체 타입이 될 수 있는 타입을 설명할 수 있어야한다. 또한, 속성값을 기반으로 해당 객체 타입 간에 타입을 좁혀야할 수도 있다.

### 4.3.1 유추된 객체 타입 유니언

변수에 여러 객체 타입 중 하나가 될 수 있는 초깃값이 주어지면 타입스크립트는 해당 타입을 객체 타입 유니언으로 유추한다.

```typescript
const poem = Math.random() > 0.5 ? { name: 'The Double Image', pages: 7 } : { name: 'Her kind', rhymes: true };

/* 타입
{
  name: string;
  pages: number;
  rhymes?: undefined;
}
|
{
  name: string;
  pages?: undefined;
  rhymes: boolean;
}
*/

poem.name; // string
poem.pages; // number | undefined;
poem.rhymes; // boolean | undefined;
```

### 4.3.2 명시된 객체 타입 유니언

객체 타입의 조합을 명시하면 객체 타입을 더 명확히 정의할 수 있다. 또한 객체 타입을 더 많이 제어할 수 있다는 이점이 있다. 특히 값의 타입이 객체 타입으로 구성된 유니언이라면 타입 시스템은 이런 모든 유니언 타입에 존재하는 속성에 대한 접근만 허용한다.

```typescript
type poemWithPages = {
  name: string;
  pages: number;
};

type PoemWithRhymes = {
  name: string;
  rhymes: boolean;
};

type Poem = PoemWithPages | PoemWithRhymes;

const poem: Poem = Math.random() > 0.5 ? { name: 'The Double Image', pages: 7 } : { name: 'Her Kind', rhymes: true };

poem.name; // Ok
poem.pages;
// Error: Property 'pages' does not exist on type 'Poem'.
// Property 'pages' does not exist on type 'PoemWithRhymes'.
poem.rhymes;
// Error: Property 'rhymes' does not exist on type 'Poem'.
// Property 'rhymes' does not exist on type 'PoemWithPages'.
```

**잠재적으로 존재하지 않는 객체의 멤버에 대한 접근을 제한하면 코드의 안전을 지킬 수 있다.** 값이 여러 타입 중 하나일 경우, 모든 타입에 존재하지 않는 속성이 객체에 존재할 거라 보장할 수 없다. 따라서 객체 타입 유니언도 타입을 좁혀야한다.

### 4.3.3 객체 타입 내로잉

코드에서 객체의 형태를 확인하고 타입 내로잉이 객체에 적용된다.

```typescript
if ('pages' in poem) {
  poem.pages; // Ok: poem은 PoemWithPages로 좁혀짐
} else {
  poem.rhymes; // Ok: poem은 PoemWithRhymes로 좁혀짐
}

if (poem.pages) {
  /* ... */
}
// Error: Property 'pages' does not exist on type 'PoemWithPages | PoemWithRhymes'.
```

위의 코드를 보면 poem의 pages가 타입 가드 역할을 하여 PoemWithPages임을 나타내는지 확인한다. 타입스크립트 if (poem.pages)와 같은 형식으로 참 여부를 확인하는 것을 허용하지 않는다. 존재하지 않는 객체의 속성에 접근하려고 시도하면 타입 가드처럼 작동하는 방식으로 사용되더라도 타입 오류로 간주된다.

### 4.3.4 판별된 유니언

유니언 타입으로 된 객체의 또 다른 인기 있는 형태는 객체의 속성이 객체의 형태를 나타내도록 하는 것이다. 이러한 타입 형태를 **판별된 유니언(discriminated union)** 이라 부르고, 객체의 타입을 가리키는 속성이 **판별값**이다. 타입스크립트는 코드에서 판별 속성을 사용해 타입 내로잉을 수행한다.

```typescript
type PoemWithPages = {
  name: string;
  pages: number;
  type: 'pages';
};

type PoemWithRhymes = {
  name: string;
  rhymes: boolean;
  type: 'rhymes';
};

type Poem = PoemWithPages | PoemWithRhymes;

const poem: Poem =
  Math.random() > 0.5
    ? { name: 'The Double Image', pages: 7, type: 'pages' }
    : { name: 'Her kind', rhymes: true, type: 'rhymes' };

if (poem.type === 'pages') {
  console.log(`It's got pages: ${poem.pages}`); // Ok
} else {
  console.log(`It rhymes: ${poem.rhymes}`);
}

poem.type; // 타입: 'pages' | 'rhymes'

poem.pages;
// Error: Property 'pages' does not exist on type 'Poem'.
```

판별된 유니언은 우아한 자바스크립트 패턴과 타입스크립트의 타입 내로잉을 아름답게 결합한다.

### 4.4 교차 타입

**`&` 교차 타입(intersection type)을 사용하여 여러 타입을 동시에 나타낼 수 있다.** 교차 타입은 일반적으로 여러 기존 객체 타입을 별칭 객체 타입으로 결합해 새로운 타입을 생성한다.

```typescript
type Artwork = {
  genre: string;
  name: string;
};

type Writing = {
  pages: number;
  name: string;
};

type WrittenArt = Artwork & Writing;

/* 다음과 같음
{
  genre: string;
  name: string;
  pages: number;
}
*/
```

교차 타입은 유니언 타입과 결합할 수 있으며, 이는 하나의 타입으로 판별된 유니언 타입을 설명하는 데 유용하다.

### 4.4.1 교차 타입의 위험성

교차 타입은 유용한 개념이지만, 스스로나 타입스크립트 컴파일러를 혼동시키는 방식으로 사용하기 쉽다. 교차 타입을 사용할 때는 가능한 한 코드를 간결하게 유지해야한다.

#### 긴 할당 가능성 오류

유니언 타입과 결합하는 것처럼 복잡한 교차 타입을 만들게 되면 함당 가능성 오류 메시지는 읽기 어려워진다. 다시 말해 복잡하면 복잡할 수록 타입 검사기의 메시지도 이해하기 더 어려워진다. **따라서, 타입을 일련의 별칭으로 된 객체 타입으로 분할하면 읽기가 훨씬 쉬워진다.**

#### never

교차 타입은 잘못 사용하기 쉽고 불가능한 타입을 생성한다. 원시 타입의 값은 동시에 여러 타입이 될 수 없기 때문에 교차 타입의 구성 요소로 함께 결합할 수 없다. **두 개의 원시 타입을 함께 시도하면 never 타입이 된다.**

대부분의 타입스크립트 프로젝트는 never 타입을 거의 사용하지 않지만 코드에서 불가능한 상태를 나타내기 위해 가끔 등장한다. 하지만 대부분 교차 타입을 잘못 사용해 발생한 실수일 가능성이 높다.

### 4.5 마치며

이번 장에서는 다양한 객체를 다루는 방법을 살펴보며 타입 시스템에 대한 이해를 확장해보았다.
