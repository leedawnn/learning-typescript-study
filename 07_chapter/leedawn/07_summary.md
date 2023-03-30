# Chapter 07

## 인터페이스

인터페이스는 연관된 이름으로 객체 형태를 설명하는 또 다른 방법이다.

타입 별칭(type alias)와 유사하지만 일반적으로 더 읽기 쉬운 오류 메시지, 더 빠른 컴파일러 성능, 클래스와의 더 나은 상호 운용성을 위해 선호된다.

### 7.1 타입 별칭 vs 인터페이스

인터페이스와 타입 별칭에 대한 주요 차이점에 대해 알아보자.

1. 인터페이스는 속성 증가를 위해 병합을 할 수 있다. 이 기능은 내장된 전역 인터페이스 또는 npm 패키지와 같은 외부 코드를 사용할 때 특히 유용하다.
2. 인터페이스는 클래스가 선언된 구조의 타입을 확인하는 데 사용할 수 있지만 타입 별칭은 사용할 수 없다.
3. 일반적으로 인터페이스에서 타입스크립트 타입 검사기가 더 빨리 작동한다. 인터페이스는 타입 별칭이 하는 것처럼 새로운 객체 리터럴의 동적인 복사 붙여넣기보다 내부적으로 더 쉽게 캐시할 수 있는 명명된 타입을 선언한다.
4. 인터페이스는 이름 없는 객체 리터럴의 별칭이 아닌 이름 있는(명명된) 객체로 간주되므로 어려운 특이 케이스에서 나타나는 오류 메시지를 좀 더 쉽게 읽을 수 있다.

3, 4번 차이점과 일관성을 유지하기 위해 기본적으로 별칭 객체 형태에 대한 인터페이스를 사용하다. 가능하다면 인터페이스 사용을 추천한다. 즉, 타입 별칭의 유니언 타입과 같은 기능이 필요할 때까지는 인터페이스를 사용하는 것이 좋다.

### 7.2 속성 타입

타입스크립트는 인터페이스가 getter, setter, 가끔 존재하는 속성 또는 임의의 속성 이름을 사용하는 등의 객체를 모델링할 수 있도록 유용한 타입 시스템 도구를 제공한다.

### 7.2.1 선택적 속성

타입 애너테이션 `:` 앞에 `?`를 사용해 인터페이스의 속성이 선택적 속성임을 나타낼 수 있다.

`undefined`를 포함한 유니언 타입의 선택적 속성과 일반 속성 사이의 차이점과 관련된 주의 사항은 객체 타입뿐만 아니라 인터페이스에도 적용된다.

### 7.2.2 읽기 전용 속성

인터페이스의 정의된 객체의 속성을 재할당하지 못하도록 인터페이스 사용자를 차단하고 싶을 때, 속성 이름 앞에 `readonly` 키워드를 추가해 다른 값으로 설정될 수 없음을 나타낸다. 이러한 `readonly` 속성은 평소대로 읽을 수 있지만 새로운 값으로 재할당하지 못한다.

```typescript
interface Page {
  readonly text: string;
}

function read(page: Page) {
  // Ok: text 속성을 수정하지 않고 읽는 것
  console.log(page.text);

  page.text += '!';
  // Error: Cannot assign to 'text' because it is a read-only property.
}
```

`readonly` 제한자는 타입 시스템에만 존재하며 인터페이스에서만 사용할 수 있다. `readonly` 제한자는 객체의 인터페이스를 선언하는 위치에서만 사용되고 실제 객체에는 적용되지 않는다.

### 7.2.3 함수와 메서드

타입스크립트는 인터페이스 멤버를 함수로 선언하는 두 가지 방법을 제공한다.

- 메서드 구문: 인터페이스 멤버를 `member(): void`와 같이 객체의 멤버로 호출되는 함수로 선언
- 속성 구문: 인터페이스 멤버를 `member(): () => void`와 같이 독립 함수와 동일하게 선언

```typescript
interface HasBothFunctionTypes {
  property: () => string;
  method(): string;
}

const hasBoth: HasBothFunctionTypes = {
  property: () => '',
  method() {
    return '';
  },
};

hasBoth.property(); // Ok
hasBoth.method(); // Ok
```

두 가지 방법 모두 `?`를 사용해 필수로 제공하지 않아도 되는 멤버로 나타낼 수 있다.

메서드와 속성 선언은 대부분 서로 교환하여 사용할 수 있다. 메서드와 속성의 주요 차이점은 다음과 같다.

- 메서드는 `readonly`로 선언할 수 없지만 속성은 가능하다.
- 인터페이스 병합은 메서드와 속성을 다르게 처리한다.
- 타입에서 수행되는 일부 작업은 메서드와 속성을 다르게 처리한다(15장에서 다룰 예정)

### 7.2.4 호출 시그니처

인터페이스와 객체 타입은 호출 시그니처(call signature)로 선언할 수 있다. 호출 시그니처는 값을 함수처럼 호출하는 방식에 대한 타입 시스템의 설명이다.

할당 가능한 매개변수와 반환 타입을 가진 함수이며, 호출 시그니처는 함수와 비슷하지만 `:` 대신 `=>`로 표시한다.

호출 시그니처는 사용자 정의 속성을 추가로 갖는 함수를 설명하는 데 사용할 수 있다. 타입스크립트는 함수 선언에 추가된 속성을 해당 함수 선언의 타입에 추가하는 것으로 인식한다.

### 7.2.5 인덱스 시그니처

일부 자바스크립트 프로젝트는 임의의 string 키에 값을 저장하기 위한 객체를 생성한다. 이러한 컨테이너 객체의 경우 모든 가능한 키에 대해 필드가 있는 인터페이스를 선언하는 것은 비현실적이거나 불가능하다.

**타입스크립트는 인덱스 시그니처 구문을 제공해 인터페이스의 객체가 임의의 키를 받고, 해당 키 아래의 특정 타입을 반환할 수 있음을 나타낸다.** 자바스크립트 객체 속성 조회는 암묵적으로 키를 문자열로 변환하기 때문에 인터페이스의 객체는 문자열 키와 함께 가장 일반적으로 사용된다. 인덱스 시그니처는 키 다음에 타입이 있고 `{[i: string]: ...}`과 같이 배열의 대괄호를 갖는다.

**인덱스 시그니처는 객체에 값을 할당할 때 편리하지만 타입 안정성을 완벽하게 보장하지는 않는다. 객체가 어떤 속성에 접근하든 간에 값을 반환해야하기 때문이다.**

**키/값 쌍을 저장하려고 하는데 키를 미리 알 수 없다면 `Map`을 사용하는 편이 더 안전하다. `.get`메서드는 항상 키가 존재하지 않음을 나타내기 위해서 `| undefined`타입을 반환한다. (9장에서 다룰 예정)**

### 7.2.6 중첩 인터페이스

인터페이스 타입도 자체 인터페이스 타입 혹은 객체 타입을 속성으로 가질 수 있다.

### 7.3 인터페이스 확장

때로는 서로 형태가 비슷한 여러 개의 인터페이스를 갖게 된다. **타입스크립트는 인터페이스가 다른 인터페이스의 모든 멤버를 복사해서 선언할 수 있는 확장된 인터페이스를 허용한다.**

확장할 인터페이스의 이름 뒤에 `extends` 키워드를 추가해서 다른 인터페이스를 확장한 인터페이스라는 걸 표시한다. 이렇게 하면 파생 인터페이스를 준수하는 모든 객체가 기본 인터페이스의 모든 멤버도 가져야한다는 것을 타입스크립트에 알려준다.

**인터페이스 확장은 프로젝트의 한 엔티티 타입이 다른 엔티티의 모든 멤버를 포함하는 상위 집합을 나타내는 실용적인 방법이다. 인터페이스 확장을 이용하면 중복 코드를 반복해서 입력하는 작업을 피할 수 있다.**

### 7.3.1 재정의된 속성

파생 인터페이스는 다른 타입으로 속성을 다시 선언해 기본 인터페이스의 속성을 재정의하거나 대체할 수 있다. 속성을 재선언하는 대부분의 파생 인터페이스는 해당 속성을 유니언 타입의 더 구체적인 하위 집합으로 만들거나 속성을 기본 인터페이스의 타입에서 확장된 타입으로 만들기 위해 사용한다.

```typescript
interface WithNullableName {
  name: string | null;
}

interface WithNonNullableName extends WithNullableName {
  name: string;
}

interface WithNumericName extends WithNullableName {
  name: number | string;
  /* 'WithNumericName' 인터페이스가 'WithNullableName' 인터페이스를 잘못 확장합니다.
  'name' 속성의 형식이 호환되지 않습니다.
    'string | number' 형식은 'string | null' 형식에 할당할 수 없습니다.
      'number' 형식은 'string' 형식에 할당할 수 없습니다.ts(2430)
  */
}
```

위의 코드를 보면 WithNullableName 타입은 WithNonNullableName에서 null을 허용하지 않도록 적절하게 다시 설정된다. **그러나 WithNumericName의 name에는 `number | string`이 허용되지 않는다. `number | string`은 `string | null`에 할당할 수 없기 때문이다.**

### 7.3.2 다중 인터페이스 확장

타입스크립트의 인터페이스는 여러 개의 다른 인터페이스를 확장해서 선언할 수 있다. 파생 인터페이스 이름에 있는 `extends` 키워드 뒤에 쉼표로 인터페이스 이름을 구분해 사용하면 된다. 파생 인터페이스는 모든 기본 인터페이스의 모든 멤버를 받는다.

```typescript
interface GivesNumber {
  giveNumber(): number;
}

interface GivesString {
  giveString(): string;
}

interface GivesBothAndEither extends GivesNumber, GivesString {
  giveEither(): number | string;
}

function useGivesBoth(instance: GivesBothAndEither) {
  instance.giveEither(); // 타입: number | string
  instance.giveNumber(); // 타입: number
  instance.giveString(); // 타입: string
}
```

여러 인터페이스를 확장하는 방식으로 인터페이스를 사용하면 코드 중복을 줄이고 다른 코드 영역에서 객체의 형태를 더 쉽게 재사용할 수 있다.

### 7.4 인터페이스 병합

인터페이스의 중요한 특징 중 하나는 서로 병합하는 능력이다. **두 개의 인터페이스가 동일한 이름으로 동일한 스코프에 선언된 경우, 선언된 모든 필드를 포함하는 더 큰 인터페이스가 코드에 추가된다.**

```typescript
interface Merged {
  fromFirst: string;
}

interface Merged {
  fromSecond: number;
}

/* 다음과 같음
  interface Merged {
    fromFirst: string;
    fromSecond: number;
  }
*/
```

위의 코드는 fromFirst와 fromSecond라는 두 개의 속성을 갖는 Merged 인터페이스를 선언한다.

인터페이스가 여러 곳에 선언되면 코드를 이해하기 어려워지므로 가능하면 인터페이스 병합을 사용하지 않는 것이 좋다.

**그러나 인터페이스 병합은 외부 패키지 또는 Window 같은 내장된 전역 인터페이스를 보강하는 데 특히 유용하다.**

### 7.4.1 이름이 충돌되는 멤버

병합된 인터페이스는 타입이 다른 동일한 이름의 속성을 여러 번 선언할 수 없다. 속성이 이미 인터페이스에 선언되어 있다면 나중에 병합된 인터페이스에서도 동일한 타입을 사용해야한다.

```typescript
interface MergedProperties {
  same: (input: boolean) => string;
  different: (input: string) => string;
}

interface MergedProperties {
  same: (input: boolean) => string; // Ok
  different: (input: number) => string;
  // 후속 속성 선언에 같은 형식이 있어야 합니다. 'different' 속성이 '(input: string) => string' 형식이어야 하는데 여기에는 '(input: number) => string' 형식이 있습니다. ts(2717)
}
```

그러나 병합된 인터페이스는 동일한 이름과 다른 시그니처를 가진 메서드는 정의할 수 있다. 이렇게 하면 메서드에 대한 함수 오버로드가 발생한다.

```typescript
interface MergedMethods {
  different(input: string): string;
}

interface MergedMethods {
  different(input: number): string; // Ok
}
```
