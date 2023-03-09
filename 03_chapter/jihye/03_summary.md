# 유니언과 리터럴

이번 장에서는 타입스크립트가 값을 바탕으로 추론을 수행하는 두 가지 핵심 개념을 소개한다.

- 유니언: 값에 허용된 타입을 두 개 이상의 가능한 타입으로 확장하는 것
- 내로잉: 값에 허용된 타입이 하나 이상의 가능한 타입이 되지 않도록 좁히는 것

## 3.1 유니언 타입

```js
let mathematician = Math.random() > 0.5 ? undefined : "Mark Goldberg";
```

mathematician은 undefined이거나 string일 수 있다. '이거 혹은 저거'와 같은 타입을 **유니언**이라고 한다. 유니언 타입은 어떤 타입인지 모르지만 두 개 이상의 옵션 중 하나라는 것을 알고 있는 경우에 코드를 처리하는 훌륭한 개념이다.

### 3.1.1 유니언 타입 선언

변수의 초깃값이 있더라도 변수에 대한 명시적 타입 애너테이션을 제공하는 것이 유용할 때 유니언 타입을 선언한다. 다음 예제에서 thinker의 초깃값은 null이지만 잠재적으로 null 대신 string이 될 수 있음을 알려준다. 명시적으로 string | null 타입 애너테이션은 타입스크립트가 thinker의 값으로 string타입의 값을 할당할 수 있음을 의미한다.

```js
let thinker: string | null = null;

if (Math.random() > 0.5) {
  thinker = "Susanne Lander"; // Ok
}
```

유니언 타입 선언은 타입 애너테이션으로 타입을 정의하는 모든 곳에서 사용할 수 있다.

### 3.1.2 유니언 속성

값이 유니언 타입일 때 타입스크립트는 유니언으로 선언한 모든 가능한 타입에 존재하는 멤버 속성에만 접근할 수 있다. 유니언 외의 타입에 접근하려고 하면 타입 검사 오류가 발생한다.

다음 스니펫에서 physicist는 number | string 타입으로 두 개의 타입에 모두 존재하는 toString()은 사용할 수 있지만, toUpperCase()와 toFixed()는 사용할 수 없다. toUpperCase()는 number 타입엔 없고, toFixed()는 string 타입에 없기 때문이다.

```js
let physicist = Math.random() > 0.5 ? "Marie Curie" : 84;

physicist.toString(); // OK

physicist.toUpperCase();

// Error: Property 'toUpperCase' dose not exist on type 'string | number'.
// Property 'toUpperCase' dose not exist on type 'number'.

physicist.toFixed();
// Error: Property 'toFixed' dose not exist on type 'string | number'.
// Property 'toFixed' dose not exist on type 'string'.
```

유니언 타입으로 정의된 여러 타입 중 하나의 타입으로 된 값의 속성을 사용하려면 코드에서 값이 보다 구체적인 타입 중 하나라는 것을 타입스크립트에게 알려야 한다. 이 과정을 **내로잉**이라고 부른다.

## 3.2 내로잉

내로잉은 값의 정의, 선언 혹은 이전에 유추된 것보다 더 구체적인 타입임을 코드에서 유추하는 것이다. 타입스크립트가 값의 타입이 이전에 알려진 것보다 더 좁혀졌다는 것을 알게 되면 값을 더 구체적인 타입으로 취급한다. 타입을 좁히는 데 사용할 수 있는 논리적 검사를 **타입 가드**라 하며 흔히 사용하는 두 가지의 타입 가드를 살펴보자.

### 3.2.1 값 할당을 통한 내로잉

변수에 값을 직접 할당하면 타입스크립트는 변수의 타입을 할당된 값의 타입으로 좁힌다.

```js
let admiral: number | string;

admiral = "Grace Hopper";

admiral.toUpperCase(); // Ok: string

admiral.toFixed();
// Error: Property 'toFixed' does not exist on type 'string'.
```

변수에 유니언 타입 애너테이션이 명시되고 초깃값이 주어질 때 값 할당 내로잉이 작동한다. 타입스크립트는 변수가 나중에 유니언 타입으로 선언된 타입 중 하나의 값을 받을 수 있지만, 처음에는 초기에 할당된 값의 타입으로 시작한다는 것을 이해한다.

### 3.2.2 조건 검사를 통한 내로잉

일반적으로 타입스크립트에서는 변수가 알려진 값과 같은지 확인하는 if 문을 통해 변수의 값을 좁히는 방법을 사용한다. 타입스크립트는 if 문 내에서 변수가 알려진 값과 동일한 타입인지 확인한다.

만약 변수가 여러 타입 중 하나라면, 일반적으로 필요한 타입과 관련된 검사를 원할 것이다. 타입스크립트는 강제로 코드를 안전하게 작성할 수 있도록 하는 고마운 언어다.

### 3.2.3 typeof 검사를 통한 내로잉

타입스크립트는 직접 값을 확인해 타입을 좁히기도 하지만, typeof 연산자를 사용할 수도 있다.

```js
let researcher = Math.random() > 0.5 ? "Rosalined Franklin" : 51;

if (typeof researcher === "string") {
  researcher.toUpperCase(); // Ok: string
}
```

!를 사용한 논리적 부정과 else 문도 잘 작동되며, 삼항 연산자를 이용해 다시 작성할 수 있다. 어떤 방법으로 작성하든 typeof 검사는 타입을 좁히기 위해 자주 사용하는 실용적인 방법이다.

## 3.3 리터럴 타입

두 개 이상의 잠재적 타입이 될 수 있는 값을 다루기 위해 유니언 타입과 내로잉을 살펴봤으니 지금부터는 **리터럴 타입**을 소개하겠다. 리터럴 타입은 좀 더 구체적인 버전의 원시 타입이다.

```js
const philosopher = "Hypatia";
```

philosopher은 얼핏 봐도 string 타입이다.
하지만 philosopher은 단지 string 타입이 아닌 "Hypatia"라는 특별한 값이다. 따라서 변수 philosopher의 타입은 기술적으로 더 구체적인 "Hypatia"다.

이것이 리터럴 타입의 개념이다. 원시 타입 값 중 어떤 것이 아닌 **특정 원싯값**으로 알려진 타입이 리터럴 타입이다. 원시 타입 string은 존재할 수 있는 모든 가능한 문자열의 집합을 나타낸다. 하지만 리터럴 타입인 "Hypatia"는 하나의 문자열만 나타낸다.

만약 변수를 const로 선언하고 직접 리터럴 값을 할당하면 타입스크립트는 해당 변수를 할당된 리터럴 값으로 유추한다.

각 원시 타입은 해당 타입이 가질 수 있는 가능한 모든 리터럴 값의 전체 조합으로 생각할 수 있다. 즉, 원시 타입은 해당 타입의 가능한 모든 리터럴 값의 집합이다.

유니언 타입 애너테이션에는 리터럴과 원시 타입을 섞어서 사용할 수 있다.

```js
let lifespan: number | "ongoing" | "uncertain";

lifespan = 89; // Ok
lifespan = "ongoing"; // Ok

lifespan = true;
// Error: Type 'true' is not assignable to type 'number' | "ongoing" | "uncertain"
```

### 3.3.1 리터럴 할당 가능성

앞서 number와 string과 같은 서로 다른 원시 타입이 서로 할당되지 못한다는 것을 보았다. 마찬가지로 0과 1처럼 동일한 원시 타입일지라도 서로 다른 리터럴 타입은 서로 할당할 수 없다.

```js
let specificallyAda: "Ada";
specificallyAda = "Ada"; // Ok

specificallyAda = "Byron";
// Error: Type '"Byron"' is not assignable to type '"Ada"'.

let someString = ""; // 타입 : string

specificallyAda = someString;
// Error: Type 'string' is not assignable to type '"Ada"'.
```

그러나 리터럴 타입은 그 값이 해당하는 원시 타입에 할당할 수 있다. 모든 특정 리터럴 문자열은 여전히 string 타입이기 때문이다.

## 3.4 엄격한 null 검사

리터럴로 좁혀진 유니언의 힘은 타입스크립트에서 **엄격한 null 검사**라 불리는 타입 시스템 영역인 '잠재적으로 정의되지 않은 undefined 값'으로 작업할 때 특히 두드러진다. 타입스크립트는 두려운 '십억 달러의 실수'를 바로잡기 위해 엄격한 null 검사를 사용하며 이는 최신 프로그래밍 언어의 큰 변화 중 하나이다.

### 3.4.1 십억 달러의 실수

'십억 달러의 실수'는 다른 타입이 필요한 위치에서 null 값을 사용하도록 허용하는 많은 타입 시스템을 가리키는 업계 용어다. 엄격한 null 검사가 없는 언어에서는 다음 예제코드처럼 string 타입 변수에 null을 할당하는 것이 허용된다.

```js
const firstName: string = null;
```

가장 유용한 옵션 중 하나인 strictNullChecks는 엄격한 null 검사를 활성화할지 여부를 결정한다. 간략하게 설명하면, strictNullChecks를 비활성화하면 코드의 모든 타입에 | null | undefined를 추가해야 모든 변수가 null 또는 undefined를 할당할 수 있다.

strictNullChecks 옵션을 false로 설정하면 다음 코드의 타입은 완벽히 안전하다고 간주되지만 틀렸다.

```js
let nameMaybe = Math.random() > 0.5 ? "Tony Hoare" : undefined;

nameMaybe.toLowerCase();
// Potential runtime error: Cannot read property 'toLowerCase' of undefined
```

엄격한 null 검사가 활성화되면, 타입스크립트는 다음 코드에서 발생하게 될 잠재적인 충돌을 확인합니다.

```js
let nameMaybe = Math.random() > 0.5 ? "Tony Hoare" : undefined;

nameMaybe.toLowerCase();
// Error: Object is possibly 'undefined'
```

엄격한 null 검사를 활성화해야만 코드가 null 또는 undefined 값으로 인한 오류로부터 안전한지 여부를 쉽게 파악할 수 있으므로 일반적으로 검사를 활성화한다. 그렇게 해야만 충돌을 방지하고 십억 달러의 실수를 제거할 수 있다.

### 3.4.2 참 검사를 통한 내로잉

자바스크립트에서 **참** 또는 **truthy**는 &&연산자 또는 if문처럼 boolean 문맥에서 true로 간주된다는 점을 떠올려보자. **falsy**로 정의된 값을 제외한 모든 값은 모두 참이다.

타입스크립트는 잠재적인 값 중 truthy로 확인된 일부에 한해서만 변수의 타입을 좁힐 수 있다.

```js
let geneticist = Math.random() > 0.5 ? "Barbara McClintock" : undefined;

if (geneticist) {
  geneticist.toUpperCase(); // Ok: string
}

geneticist.toUpperCase();
// Error: Object is possibly 'undfined'.
```

논리연산자인 &&과 ?는 참 여부를 검사하는 일도 잘 수행한다. 하지만 참 여부 확인 외에 다른 기능은 제공하지 않는다.

```js
geneticist && geneticist.toUpperCase(); // Ok: string | undefined
geneticist?.toUpperCase(); // Ok: string | undefined
```

### 3.4.3 초깃값이 없는 변수

자바스크립트에서 초깃값이 없는 변수는 기본적으로 undefined가 된다. 이는 타입 시스템에서 극단적인 경우를 나타내기도 한다. 만일 undefined를 포함하지 않는 타입으로 변수를 선언한 다음, 값을 할당하기 전에 사용하려고 시도하면 어떻게 될까?

값에 할당되기 전에 속성 중 하나에 접근하려는 것처럼 해당 변수를 사용하려고 시도하면 아직 할당되기 전이라는 오류 메시지가 나타난다.

```js
let mathematician: string;

mathematician?.length;
// Error: Variable 'mathematician' is used before being assigned.

mathematician = "Mark Goldberg";
mathematician.length; // Ok
```

변수 타입에 undefined가 포함되어 있는 경우에는 오류가 보고되지 않는다.

```js
let mathematician: string | undefined;

mathematician?.length; // Ok

mathematician = "Mark Goldberg";
mathematician.length; // Ok
```

## 3.5 타입 별칭

타입스크립트에는 재사용하는 타입에 더 쉬운 이름을 할당하는 **타입 별칭**이 있다. `타입 별칭은 type 새로운 이름 = 타입 형태`를 갖는다. 편의상 타입 별칭은 파스칼 케이스로 이름을 지정한다.

```js
type MyName = ...;
```

타입 별칭은 타입 시스템의 '복사해서 붙여넣기'처럼 작동한다. 상당히 긴 유니언 타입을 타입 별칭을 사용해 다음과 같이 작성할 수 있다.

```js
type RawData = boolean | number | string | null | undefined;

let rawDateFirst: RawData;
let rawDateSecond: RawData;
let rawDateThird: RawDate;
```

### 3.5.1 타입 별칭은 자바스크립트가 아니다.

타입 별칭은 타입 애너테이션처럼 자바스크립으로 컴파일되지 않는다. 순전히 타입스크립트 타입 시스템에만 존재하기에 앞서 다룬 코드는 다음 자바스크립트로 컴파일된다.

```js
let rawDateFirst;
let rawDateSecond;
let rawDateThird;
```

타입 별칭은 순전히 타입 시스템에만 존재하므로 런타임 코드에서는 참조할 수 없다.

```js
type SomeType: string | undefined;

console.log(SomeType);
// Error: 'SomeType' only refers to a type, but is being used as a value here.
```

### 3.5.2 타입 별칭 결합

타입 별칭은 다른 타입 별칭을 참조할 수 있다. 유니언 타입인 타입 별칭 내에 또 다른 유니언 타입인 타입 별칭을 포함하고 있다면 다른 타입 별칭을 참조하는 것이 유용하다.

```js
type Id = number | string;

// IdMaybe 타입은 다음과 같음: number | string | undefined | null
type IdMaybe = Id | undefined | null;
```

### 3.6 마치며

이 장에서는 타입스크립트의 유니언과 리터럴 타입을 소개하고 구조화된 코드에서 타입 시스템이 더 구체적인 타입을 유추하는 방법에 대해 살펴보았다.
