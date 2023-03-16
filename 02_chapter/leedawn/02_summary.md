# Chapter 02

## 타입 시스템

### 2.1 타입의 종류

'타입'은 자바스크립트에서 다루는 값의 **형태**에 대한 설명이다. 여기서 '**형태**'란 값에 존재하는 속성과 메서드 그리고 내장되어 있는 typeof 연산자가 설명하는 것을 의미한다.

타입스크립트의 가장 기본적인 타입은 자바스크립트의 7가지 원시 타입과 동일하다.

- null
- undefined
- boolean
- string
- number
- bigint // 0n, 2n, -4n ...
- symbol

타입스크립트는 타입추론이 가능하다.

### 2.1.1 타입 시스템

타입 시스템은 프로그래밍 언어가 프로그램에서 가질 수 있는 타입을 이해하는 방법에 대한 규칙 집합이다.

기본적으로 타입스크립트의 타입 시스템은 다음과 같이 작동한다.

1. 코드를 읽고 존재하는 모든 타입과 값을 이해한다.
2. 각 값이 초기 선언에서 가질 수 있는 타입을 확인한다.
3. 각 값이 추후 코드에서 어떻게 사용될 수 있는지 모든 방법을 확인한다.
4. 값의 사용법이 타입과 일치하지 않으면 사용자에게 오류를 표시한다.

타입스크립트의 타입 시스템에 대한 이해는 타입스크립트 코드를 이해하는 데 중요한 기술이다.

### 2.1.2 오류 종류

- **구문 오류** : 타입스크립트가 자바스크립트로 변환되는 것을 차단한 경우
- **타입 오류** : 타입 검사기에 따라 일치하지 않는 것이 감지된 경우

위의 2가지는 타입스크립트를 작성하는 동안 가장 자주 접하게 되는 오류이다. 둘의 차이점은 중요함!

#### 구문 오류

구문 오류는 타입스크립트가 코드로 이해할 수 없는 잘못된 구문을 감지할 때 발생한다. 이는 타입스크립트가 타입스크립트 파일에서 자바스크립트 파일을 올바르게 생성할 수 없도록 차단한다.

다음 코드에서는 예기치 않은 let에 대한 구문 오류가 발생한다.

```typescript
let let wat;
// Error: ',' expected.
```

타입스크립트 컴파일러 버전에 따라 컴파일된 자바스크립트 결과는 다음과 같다.

```javascript
let let, wat;
```

#### 타입 오류

타입 오류는 타입스크립트의 타입 검사기가 프로그램의 타입에서 오류를 감지했을 떄 발생한다. 오류가 발생했다고 해서 타입스크립트 구문이 자바스크립트로 변환되는 것을 차단하지는 않는다.

### 2.2 할당 가능성

타입스크립트는 변수의 초깃값을 읽고 해당 변수가 허용되는 타입을 결정한다. 나중에 해당 변수에 새로운 값이 할당되면, 새롭게 할당된 값의 타입이 변수의 타입과 동일한지 확인한다.

타입스크립트에서 함수 호출이나 변수에 값을 제공할 수 있는지 여부를 확인하는 것을 **할당 가능성(assignability)** 이라고 합니다. 즉, **전달된 값이 예상된 타입으로 할당 가능한지 여부를 확인**한다. (할당 가능성은 이번 장 이후에 더 복잡한 객체를 비교할 때 더 중요한 용어가 됨)

### 2.2.1 할당 가능성 오류 이해하기

'Type... is not assignable to type...' 형태의 오류는 타입스크립트 코드를 작성할 때 만나게 되는 가장 일반적인 오류 중 하나이다.

해당 오류 메시지에서 언급된 **첫 번째 type**은 코드에서 **변수에 할당하려고 시도하는 값**이다. **두 번째 type**은 **값이 할당되는 변수**이다.

```typescript
let lastName = 'King';
lastName = true;
// Error: Type 'boolean' is not assignable to type 'string'.
```

### 2.3 타입 애너테이션

기본적으로 변수를 암묵적인 any 타입으로 간주한다. 초기 타입을 유추할 수 없는 변수는 **진화하는 any**라고 부른다. 특정 타입을 강제하는 대신 새로운 값이 할당될 때마다 변수 타입에 대한 이해를 발전시킨다.

아래의 코드를 보면 진화하는 any 변수인 rocker에 처음에는 string이 할당되는데, 이는 toUpperCase() 같은 string 메서드를 갖는 것을 의미하지만, 그 다음에는 number 타입으로 진화되는 것을 확인할 수 있다.

```typescript
let rocker; // type: any

rocker = 'Joan Jett'; // type: string
rocker.toUpperCase(); // Ok

rocker = 19.58; // type: number
rocker.toPrecision(1);

rocker.toUpperCase();
// Error: 'toUpperCase' does not exist on type 'number'.
```

**일반적으로 any 타입을 사용해 any 타입으로 진화하는 것을 허용하게 되면 타입스크립트의 타입 검사 목적을 부분적으로 쓸모없게 만든다.**

타입스크립트는 초깃값을 할당하지 않고도 변수의 타입을 선언할 수 있는 구문인 **타입 애너테이션(type annotation)** 을 제공한다.

```typescript
let rocker: string;
rocker = 'Joan Jett';
```

이러한 타입 애너테이션은 타입스크립트에만 존재하며 런타임 코드에 영향을 주지 않고, 유효한 자바스크립트 구문도 아니다. tsc 명령어를 실행해 타입스크립트 소스 코드를 자바스크립트로 컴파일하면 해당 코드가 삭제가 된다.

```typescript
// 출력된 .js 파일
let rocker;
rocker = 'Joan Jett';
```

변수에 타입 애너테이션으로 정의한 타입 외의 값을 할당하면 타입 오류가 발생한다.

### 2.3.1 불필요한 타입 애너테이션

다음 코드에서 string 타입 애너테이션은 중복이다. 타입스크립트가 이미 firstName이 string 타입임을 유추할 수 있기 때문이다.

```typescript
let firstName: string = 'Tina'; // 타입 시스템은 변경되지 않음
```

다음 firstName은 string 타입으로 선언되었지만, number 값인 42로 초기화되었다. 이렇게 되면 타입스크립트가 호환되지 않는다는 것을 보여준다.

```typescript
let firstName: string = 42;
// Error: Type 'number' is not assignable to type 'string'.
```

**많은 개발자는 아무것도 변하지 않는 변수에는 타입 애너테이션을 추가하지 않기를 선호한다.** 번거롭기도 하고, 특히 타입이 변경되거나 복잡한 타입일 떄 더욱 그렇다.

### 2.4 타입 형태

**타입스크립트는 객체에 어떤 멤버 속성이 존재하는지 알고 있다.** 만약 코드에서 변수의 속성에 접근하려고 한다면, 타입스크립트는 접근하려는 속성이 해당 변수의 타입에 존재하는지 확인한다.

예를 들어, string 타입의 변수를 선언한다고 가정하자. 이 변수를 사용할 때 타입스크립트는 string 타입에서 사용 가능한 작업만을 허용한다.

타입은 더 복잡한 형태, 특히 객체일 수도 있다. 객체에 존재하지 않는 키를 호출하려고 하면, 오류를 표시한다. **즉, 타입스크립트는 객체의 형태에 대한 할당 가능성 뿐만 아니라 객체 사용과 관련된 문제도 알려준다.**

### 2.4.1 모듈

다음은 a.ts와 b.ts 파일 모두 모듈이고, 이름이 동일한 shared 변수를 문제없이 내보내는 코드이다. c.ts는 가져온 shared 변수와 c.ts에 정의된 shared 변수의 이름이 충돌되어 타입 오류가 발생한다.

```typescript
// a.ts
export const shared = 'Cher';
```

```typescript
// b.ts
export const shared = 'Cher';
```

```typescript
// c.ts
import { shared } from './a';
// Error: Import declaration conflicts with local declaration of 'shared'.

import { shared } from './b';
// Error: Individual declarations in merged declaration
// 'shared' must be all exported or all local.
```

그러나 파일이 스크립트면 타입스크립트는 해당 파일을 전역 스코프로 간주하므로 모든 스크립트가 파일의 내용에 접근할 수 있다. 즉, 스크립트 파일에 선언된 변수는 다른 스크립트 파일에 선언된 변수와 동일한 이름을 가질 수 없다.

아래의 코드는 a.ts와 b.ts 파일은 모듈 스타일의 export 또는 import 문이 없기 때문에 일반 스크립트로 간주된다. 따라서 동일한 이름의 변수가 동일한 파일에 선언된 것처럼 서로 충돌한다.

```typescript
// a.ts
const shared = 'Cher';
// Error: Cannot redeclare block-scoped variable 'shared'.
```

```typescript
// b.ts
const shared = 'Cher';
// Error: Cannot redeclare block-scoped variable 'shared'.
```

타입스크립트 파일에 Cannot redeclare...라는 오류가 나면 파일에 아직 export 또는 import 문을 추가하지 않았기 때문일 수 있다. export나 import 문 없이 파일을 모듈로 만들어야 한다면 파일의 아무 곳에 `export {};` 를 추가해 강제로 모듈이 되도록 만든다.

```typescript
const shared = 'Cher';

export {};
```

### 2.5 마치며

이 장에서는 타입스크립트의 타입 시스템이 어떻게 작동하는지 살펴보았다.

- '타입'은 무엇인지 알아보고 타입스크립트가 인식하는 원시 타입 이해하기
- '타입 시스템'은 무엇인지 알아보고 타입스크립트의 타입 시스템이 코드를 이해하는 방법 삺보기
- 타입 오류와 구문 오류의 차이점
- 유추된 변수 타입과 변수 할당 가능성
- 타입 애너테이션으로 변수 타입을 명시적으로 선언하고 any 타입의 진화 방지하기
- 타입 형태에서 객체 멤버 확인하기
- 스크립트 파일과는 다른 ECMA 스크립트 모듈 파일의 선언 스코프
