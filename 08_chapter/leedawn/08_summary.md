# Chapter 08

## 클래스

### 8.1 클래스 메서드

매개변수 타입에 타입이나 기본값을 지정하지 않으면 any 타입을 기본으로 갖는다. 메서드를 호출하려면 허용 가능한 수의 인수가 필요하고, 재귀함수가 아니라면 대부분 반환 타입을 유추할 수 있다.

```typescript
class Greeter {
  greet(name: string) {
    console.log(`${name}, do your stuff!`);
  }
}

new Greeter().greet('Miss Frizzle'); // Ok

new Greeter().greet();
// Error: Expected 1 arguments, but got 0.
```

클래스 생성자(constructor)는 매개변수와 관련하여 전형적인 클래스 메서드처럼 취급된다.

### 8.2 클래스 속성

타입스크립트에서 클래스의 속성을 읽거나 쓰려면 클래스에 명시적으로 선언해야한다. 클래스 속성은 인터페이스와 동일한 구문을 사용해 선언한다. 클래스 속성 이름 뒤에는 선택적으로 타입 애너테이션이 붙는다.

타입스크립트는 생성자 내의 할당에 대해서 그 멤버가 클래스에 존재하는 멤버인지 추론하려고 시도하지 않는다.

```typescript
class FieldTrip {
  destination: string;

  constructor(destination: string) {
    this.destination = destination; // Ok
    console.log(`We're going to ${this.destination}!`);
  }

  this.nonexistent = destination;
  // Error: Property 'nonexistent' does not exist on type 'FieldTrip'.
}
```

위의 코드를 보면 destination은 string으로 명시적으로 선언되어 있어 FieldTrip 클래스 인스턴스에 할당되고 접근할 수 있따. 하지만 noexistent 속성은 선언하지 않았기 때문에 생성자에서 this.nonexistent 할당은 허용되지 않는다.

### 8.2.1 함수 속성

자바스크립트에는 클래스의 멤버를 호출 가능한 함수로 선언하는 두 가지 구문이 있다.

- 메서드 접근 방식 : `myFunction(){}`
  메서드 접근 방식은 함수를 클래스 프로토타입에 할당하므로 모든 클래스 인스턴스는 동일한 함수 정의를 사용한다.

  ```typescript
  class WithMethod {
    myMethod() {}
  }

  new WithMethod().myMethod === new WithMethod().myMethod; // true
  ```

- 값이 함수인 속성을 선언하는 방식
  이 방식은 클래스의 인스턴스당 새로운 함수가 생성되며, 항상 클래스 인스턴스를 가리켜야 하는 화살표 함수에서 this 스코프를 사용하면 클래스 인스턴스당 새로운 함수를 생성하는 시간과 메모리 비용 측면에서 유용할 수 있다.

  ```typescript
  class WithProperty {
    myProperty: () => {};
  }

  new WithMethod().myProperty === new WithMethod().myProperty; // false
  ```

### 8.2.2 초기화 검사

엄격한 컴파일러 설정이 활성화된 상태에서 타입스크립트는 undefined 타입으로 선언된 각 속성이 생성자에서 할당되었는지 확인한다. 이와 같은 엄격한 초기화 검사는 클래스 속성에 값을 할당하지 않는 실수를 예방할 수 있어 유용하다.

엄격한 초기화 검사가 없다면, 비록 타입 시스템이 undefined 값에 접근할 수 없다고 말할지라도 클래스 인스턴스는 undefined 값에 접근할 수 없다.

```typescript
class WithProperty {
  myProperty: () => {};
}

new WithMethod().myProperty === new WithMethod().myProperty; // false
```

#### 확실하게 할당된 속성

엄격한 초기화 검사가 유용한 경우가 대부분이지만 클래스 생성자 다음에 클래스 속성을 의도적으로 할당하지 않는 경우가 있을 수도 있다. **엄격한 초기화 검사를 적용하면 안되는 속성인 경우에는 이름 뒤에 `!`를 추가해 검사를 비활성화하도록 설정한다. 이렇게 하면 타입스크립트에 속성이 처음 사용되기 전에 undefined 값이 할당된다.**

```typescript
class ActivitiesQueue {
  pending!: string[]; // Ok

  initialize(pending: string[]) {
    this.pending = pending;
  }

  next() {
    return this.pending.pop();
  }
}

const activities = new ActivitiesQueue();

activities.initialize(['eat', 'sleep', 'learn']);
activities.next();
```

> warning : 클래스 속성에 대해 엄격한 초기화 검사를 비활성화하는 것은 종종 타입 검사에는 적합하지 않은 방식으로 코드가 설정된다는 신호이다. `!` 어설션을 추가하고 속성에 대한 타입 안정성을 줄이는 대신, 클래스를 리팩터링해서 어설션이 더 이상 필요하지 않도록 하세요.

### 8.2.3 선택적 속성

클래스에서도 선언된 속성 이름 뒤에 `?`를 추가해 속성을 옵션으로 선언한다. 선택적 속성은 `| undefined`를 포함하는 유니언 타입과 거의 동일하게 작동한다. 엄격한 초기화 검사는 생성자에서 선택적 속성을 명시적으로 설정하지 않아도 문제가 되지 않는다.

### 8.2.4 읽기 전용 속성

클래스에서도 `readonly` 키워드를 통해 속성을 읽기 전용으로 선언할 수 있다. `readonly` 키워드는 타입 시스템에만 존재하며 자바스크립트로 컴파일할 때 삭제된다.

`readonly`로 선언된 속성은 선언된 위치 또는 생성자에서 초깃값만 할당할 수 있다. 클래스 내의 메서드를 포함한 다른 모든 위치에서 속성은 읽을 수만 있고, 쓸 수는 없다.

> warning : npm 패키지로 게시한 코드를 사용하는 외부인이 `readonly` 제한자를 존중하지 않을 수 있다. 특히 자바스크립트를 작성 중이고 타입 검사를 하지 않는 사용자라면 더욱 그렇다. 진정한 읽기 전용 보호가 필요하다면 `# private` 필드나 `get()` 함수 속성 사용을 고려하자.

원시 타입의 초깃값을 갖는 `readonly`로 선언된 속성은 다른 속성과 조금 다르다. 이런 속성은 더 넓은 원싯값이 아니라 값의 타입이 가능한 한 좁혀진 리터럴 타입으로 유추된다.

### 8.3 타입으로서의 클래스

타입 시스템에서의 클래스는 클래스 선언이 런타임 값(클래스 자체)과 타입 애너테이션에서 사용할 수 있는 타입을 모두 생성한다는 점에서 상대적으로 독특하다.

### 8.4 클래스와 인터페이스

타입스크립트는 클래스 이름 뒤에 `implements` 키워드와 인터페이스 이름을 추가함으로써 클래스의 해당 인스턴스가 인터페이스를 준수한다고 선언할 수 있다.

```typescript
interface Learner {
  name: string;
  study(hours: number): void;
}

class Student implements Learner {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  study(hours: number) {
    for (let i = 0; i < hours; i++) {
      console.log('...studying...');
    }
  }
}

class Slacker implements Learner {
  // 'Slacker' 클래스가 'Learner' 인터페이스를 잘못 구현합니다.
  // 'Slacker' 형식에 'Learner' 형식의 name, study 속성이 없습니다.
}
```

### 8.4.1 다중 인터페이스 구현

타입스크립트의 클래스는 다중 인터페이스를 구현해 선언할 수 있다.

### 8.5 클래스 확장

타입스크립트는 다른 클래스를 확장하거나 하위 클래스를 만드는 자바스크립트 개념에 타입 검사를 추가한다.

### 8.5.1 할당 가능성 확장

파생 인터페이스가 기본 인터페이스를 확장하는 것과 마찬가지로 하위 클래스도 기본 클래스의 멤버를 상속한다. 하위 클래스의 인스턴스는 기본 클래스의 모든 멤버를 가지므로 기본 클래스의 인스턴스가 필요한 모든 곳에서 사용할 수 있다.

### 8.5.2 재정의된 생성자

자바스크립트와 마찬가지로 타입스크립트에서 하위 클래스는 자체 생성자를 정의할 필요가 없다. 자체 생성자가 없는 하위 클래스는 암묵적으로 기본 클래스의 생성자를 사용한다.

하위 클래스가 자체 생성자를 선언하면 `super`키워드를 통해 기본 클래스 생성자를 호출해야 한다.

### 8.5.3 재정의된 메서드

하위 클래스의 메서드가 기본 클래스의 메서드에 할당될 수 있는 한 하위 클래스는 기본 클래스와 동일한 이름으로 새 메서드를 다시 선언할 수 있다. 하위 클래스는 기본 클래스와 구조적으로 일치해야한다.

### 8.5.4 재정의된 속성

하위 클래스는 새 타입을 기본 클래스의 타입에 할당할 수 있는 한 동일한 이름으로 기본 클래스의 속성을 명시적으로 다시 선언할 수 있다. 재정의된 메서드와 마찬가지로 하위 클래스는 기본 클래스와 구조적으로 일치해야 한다.

### 8.6 추상 클래스

때로는 일부 메서드의 구현을 선언하지 않고, 대신 하위 클래스가 해당 메서드를 제공할 것을 예상하고 기본 클래스를 만드는 방법이 유용할 수 있다. 추상화하려는 클래스 이름과 메서드 앞에 `abstract` 키워드를 추가한다.

주의해야할 점은 추상 클래스를 인스턴스화 할 수 없다. 추상 클래스가 아닌 클래스만 인스턴스화할 수 있다.

### 8.7 멤버 접근성

자바스크립트에서는 클래스 멤버 이름 앞에 `#`을 추가해 `private` 클래스 멤버임을 나타낸다. `private` 클래스 멤버는 해당 클래스 인스턴스에서만 접근할 수 있다. 자바스크립트 런타임은 클래스 외부 코드 영역에서 `private`메서드나 속성에 접근하려고 하면 오류를 발생시킴으로써 프라이버시를 강화한다.

- `public(기본값)` : 모든 곳에서 누구나 접근 가능
- `protected` : 클래스 내부 또는 하위 클래스에서만 접근 가능
- `private` : 클래스 내부에서만 접근 가능

### 8.7.1 정적 필드 제한자

자바스크립트는 `static` 키워드를 사용해 클래스 자체에서 멤버를 선언한다. 타입스크립트는 `static` 키워드를 단독으로 사용하거나 `readonly`와 접근성 키워드를 함께 사용할 수 있도록 지원한다.

`static` 클래스 필드에 대해 `readonly`와 접근성 제한자를 사용하면 해당 필드가 해당 클래스 외부에서 접근되거나 수정되는 것을 제한하는데 유용하다.
