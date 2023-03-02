# 01 자바스크립트에서 타입스크립트로

## 1.1 자바스크립트의 역사

자바스크립트는 1995년에 설계된 후, 특성과 결점에도 불구하고 다양한 환경에서 호환성을 유지해왔으며, 인터넷의 놀라운 성장을 가능하게 했습니다.

## 1.2 바닐라 자바스크립트의 함정

```
바닐라란? 언어 확장이나 프레임워크 없이 자바스크립트를 사용하는 것
```

1. 자바스크립트같은 동적 타입 언어는 컴파일러의 충돌 가능성이 있어도 실행하여 안전성이 떨어진다.
2. 의미를 설명하는 표준화된 문서의 부족. 주석으로 함수와 변수를 설명하는 JSDoc가 있지만 코드베이스에서 사용하기 불편하다.
3. 부족한 개발자 도구.

### 1.3 타입스크립트

타입스크립트는 네 가지로 설명됩니다.

- 프로그래밍 언어: 자바스크립트의 모든 구문과, 타입을 정의하고 사용하기 위한 새로운 타입스크립트 고유 구문이 포함된 언어
- 타입 검사기: 자바스크립트 및 타입스크립트로 작성된 일련의 파일에서 생성된 모든 구성 요소를 이해하고, 잘못 구성된 부분을 알려주는 프로그램
- 컴파일러: 타입 검사기를 실행하고 문제를 보고한 후 이에 대응하는 자바스크립트 코드를 생성하는 프로그램
- 언어 서비스: 타입 검사기를 사용해 비주얼 스튜디오 코드와 같은 편집기에 개발자에게 유용한 유틸리티 제공법을 알려주는 프로그램

### 1.4 타입스크립트 플레이그라운드에서 시작하기

#### 1.4.1 타입스크립트 실전

https://www.typescriptlang.org/ko/play
타입스크립트에서 제공한 공식 플레이그라운드 웹사이트

#### 1.4.2 제한을 통한 자유

코드를 지정한 방법으로만 사용하도록 제한하여 한 영역을 변경해도 다른 영역의 코드는 멈추지 않는다.

- 예를 들어 매개 변수가 두 개 에서 하나로 변경되었지만, 함수를 호출하는 코드는 여전히 두 개의 문자열을 사용하므로 오류가 발생합니다.
- 오류 없이 실행되지만, 두 번째로 전달한 매개 변수는 실행에서 제외됩니다.

#### 1.4.3 정확한 문서화

타입스크립트는 구문을 통해 객체의 형태를 설명하고, 객체가 어떻게 보이는지 설명하여 이해를 돕습니다.

#### 1.4.4 더 강력한 개발자 도구

- VS Code 같은 편집기에서 타입스크립트로 코드를 작성하면 편집기는 타입스크립트를 더 깊게 이해하여 코드에 제안을 표시하며, 이러한 제안은 개발 시 유용합니다.
- 데이터 입력시 문자열의 모든 내장 코드를 자동 완성으로 제안합니다.

#### 1.4.5 구문 컴파일하기

타입스크립트 컴파일러에 자바스크립트 구문을 입력하면 타입 검사 후, 작성된 코드에 해당하는 자바스크립트를 출력합니다.

### 1.5 로컬에서 시작하기

Node.js가 설치되어 있으면 타입스크립트 실행이 가능합니다. 다음은 타입스크립트 최신 버전 명령어입니다.

```
npm i -g typescript
```

이제 명령줄에서 tsc(타입스크립트 컴파일러) 명령어로 타입스크립트를 실행할 수 있습니다. 다음 명령어를 통해 올바르게 설정되었는지 확인합시다.

```
tsc --version
```

#### 1.5.1 로컬에서 실행하기

타입스크립트 설치 후, 실행할 로컬 폴더를 설정합시다. 컴퓨터 아무 곳에나 폴더를 만들고 다음 명령어를 실행해 신규 tsconfig.json 구성 파일을 생성합니다.

```
tsc --init
```

tsconfig.json 파일은 타입스크립트가 코드를 분석할 때 사용하는 설정을 선언합니다. tsc를 실행해 폴더의 모든 파일을 컴파일하도록 지시가능하고, 타입스크립트가 tsconfig.json을 참조할 수 있습니다.

다음 내용이 포함된 index.ts 파일을 추가합니다.

```
console.blub("Nothing is worth more than laughter")
```

그런 다음 tsc 명령에 index.ts 파일명을 알려줍니다.

```
tsc index.ts
```

그러면 오류가 표됩니다. 실제로 blub은 console에 존재하지 않습니다. 타입스크립트를 정상적으로 작동시키기 위해 코드를 수정하기 전에 tsc가 console.blub를 포함해 index.js를 생성했다는 점에 주목하세요.

비록 코드에 타입 오류가 있었지만, 구문은 여전히 완벽하게 유효합니다. 타입스크립트 컴파일러는 타입 오류와는 상관없이 입력 파일로부터 자바스크립트를 계속 생성합니다.

#### 1.5.2 편집기 기능

tsconfig.json 파일을 생성할 때의 또 다른 이점은 편집기에서 특정 폴더를 열었을 때, 편집기가 이제 해당 폴더를 타입스크립트 프로젝트로 인식한다는 것입니다.

### 1.6 타입스크립트에 대한 오해

모든 도구는 이점이 있지만 한계가 있습니다. 타입스크립트의 몇 가지 제약을 알아봅시다.

#### 1.6.1 잘못된 코드 해결책

타입스크립트는 클래스나 함수 사용 여부와 같은 코드 스타일을 강요하지 않으며, 앵귤러, 리액트 등의 특정 애플리케이션 프레임워크와도 연관되어 있지 않습니다.

#### 1.6.2 자바스크립트로의 확장

타입스크립트의 설계목표는 다음과 같습니다.

- 현재와 미래의 ECMA스크립트 제안에 맞춘다.
- 모든 자바스크립트 코드의 런타임 동작을 유지한다.
  타입스크립트는 자바스크립트의 작동 방식을 전혀 변경하지 않습니다.

#### 1.6.3 자바스크립트보다 느림

런타임에서 타입스크립트는 자바스크립트가 느리다는 주장은 오해의 소지가 있습니다.

- 타입스크립트가 코드에 적용하는 유일한 변경 사항은 오래된 런타임 환경을 지원하기 위해 이전 버전의 자바스크립트로 코드를 컴파일하도록 요청하는 경우입니다.
- 그러나 타입스크립트는 코드를 빌드하는 데 시간이 조금 더 걸립니다. 타입스크립트 코드는 브라우저나 Node.js와 같은 환경에서 실행 전 자바스크립트로 컴파일되어야 합니다.
- 코드에서 발생할 수 있는 오류를 분석하는 느린 타입스크립트 기능은 실행 가능한 애플리케이션 코드 파일을 생성하는 것과는 분리된 채로 수행합니다.

#### 1.6.4 진화가 끝남

타입스크립트의 기본 원칙은 거의 변함이 없겠지만, 오류 메시지, 더 멋진 기능 그리고 편집기와의 통합은 시간이 지남에 따라 개선될 것입니다.

### 1.7 마치며

이 장에서는 자바스크립트의 주요 약점과 타입스크립트가 작옹하는 방식, 타입스크립트를 시작하는 방법을 알아봤습니다.

```
- 자바스크립트의 간략한 역사
- 자바스크립트의 함정: 값 비싼 자유, 부족한 문서, 부족한 개발자 도구
- 프로그래밍 언어, 타입 검사기, 컴파일러 및 언어 서비스 역할을 하는 타입스크립트
- 타입스크립트의 장점: 제한을 통한 자유로움, 정확한 문서화, 강력한 개발자 도구
- 타입스크립트 플레이그라운드 및 컴퓨터에서 로컬로 타입스크립트 코드 작성하기
- 타입스크립트에 대한 오해: 잘못된 코드 해결책, 자바스크립트로의 확장, 자바스크립트보다 느림, 진화가 끝남
```