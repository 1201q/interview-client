const questions = [
  {
    question: 'px, em, rem의 차이에 대해 설명해주세요.',
    role: 'fe',
  },
  {
    question: 'CSS로 반응형 웹을 구현할 때는 주로 어떤 단위를 사용하시나요?',
    role: 'fe',
  },
  {
    question: 'vw, vh에 대해 설명해주세요.',
    role: 'fe',
  },
  {
    question: 'CSS 선택자의 우선순위에 대해 설명해주세요.',
    role: 'fe',
  },
  {
    question:
      '페이지 크기가 변해도 항상 같은 비율을 유지하는 요소를 만들려면 CSS를 어떻게 설정해야될까요?',
    role: 'fe',
  },
  {
    question: 'Flexbox에 대해 설명해주세요.',
    role: 'fe',
  },
  {
    question: 'float의 동작에 대해 설명해주세요.',
    role: 'fe',
  },
  {
    question: 'CSS에서 Cascading에 대해 설명해주세요.',
    role: 'fe',
  },
  {
    question: 'SCSS에 대해 설명해주세요.',
    role: 'fe',
  },
  {
    question: 'position 속성에 대해 설명해주세요.',
    role: 'fe',
  },
  {
    question: 'margin과 padding에 대해 설명해주세요.',
    role: 'fe',
  },
  {
    question:
      'HTML 렌더링 도중 JavaScript가 실행되면 렌더링이 멈추는 이유가 뭔가요?',
    role: 'fe',
  },
  {
    question: 'Attribute와 Property의 차이에 대해 설명해주세요.',
    role: 'fe',
  },
  {
    question: 'display 속성에 어떤 것들이 있는지 설명해 주세요.',
    role: 'fe',
  },
  {
    question: 'CSS 애니메이션과 JS 애니메이션의 차이에 대해서 설명해 주세요.',
    role: 'fe',
  },
  {
    question: 'CSS in JS의 장단점에 대해 설명해주세요.',
    role: 'fe',
  },
  {
    question: '시맨틱 마크업에 대해 설명해주세요.',
    role: 'fe',
  },
  {
    question: 'HTML5의 태그에 대해 설명해주세요.',
    role: 'fe',
  },
  {
    question: 'script 태그에서 Async와 Defer의 차이에 대해 설명해주세요.',
    role: 'fe',
  },
  {
    question: '가상 클래스에 대해 설명해주세요.',
    role: 'fe',
  },
  {
    question: 'margin 병합에 대해 설명해주세요.',
    role: 'fe',
  },
  {
    question: '자바스크립트는 무슨 언어인가요?',
    role: 'fe',
  },
  {
    question: '변수 선언, 초기화, 할당의 차이점에 대해 설명해주세요.',
    role: 'fe',
  },
  {
    question: '데이터 타입에 대해 설명해주세요.',
    role: 'fe',
  },
  {
    question: '생성자에 대해 설명해주세요.',
    role: 'fe',
  },
  {
    question: 'this에 대해 설명해주세요.',
    role: 'fe',
  },
  {
    question: 'call, apply, bind에 대해 설명해주세요.',
    role: 'fe',
  },
  {
    question: '콜백 함수에 대해 설명해주세요.',
    role: 'fe',
  },
  {
    question: '콜백 지옥을 해결하는 방법을 설명해주세요.',
    role: 'fe',
  },
  {
    question: 'Promise에 대해 설명해주세요.',
    role: 'fe',
  },
  {
    question: 'Promise.all() 에 대해 설명해주세요.',
    role: 'fe',
  },
  {
    question: 'Promise와 Callback를 비교 설명해주세요.',
    role: 'fe',
  },
  {
    question: 'Async, Await이 뭔지 그리고 사용 방법을 설명해주세요.',
    role: 'fe',
  },
  {
    question: 'Promise와 Async, Await의 차이를 설명해주세요.',
    role: 'fe',
  },
  {
    question: 'AJAX에 대해 설명해주세요.',
    role: 'fe',
  },
  {
    question: 'var, let, const 차이를 설명해주세요.',
    role: 'fe',
  },
  {
    question: 'TDZ에 대해 설명해주세요.',
    role: 'fe',
  },
  {
    question: '함수 선언형과 함수 표현식의 차이에 대해 설명해주세요.',
    role: 'fe',
  },
  {
    question: '이벤트 버블링과 캡처링에 대해 설명해주세요.',
    role: 'fe',
  },
  {
    question: '이벤트 위임에 대해서 설명해주세요.',
    role: 'fe',
  },
  {
    question: '이벤트 위임의 동작 방식에 대해서 설명해주세요.',
    role: 'fe',
  },
  {
    question: '호이스팅과 발생하는 이유에 대해 설명해주세요.',
    role: 'fe',
  },
  {
    question: '스코프 (Scope)에 대해 설명해주세요.',
    role: 'fe',
  },
  {
    question: '스코프 체인에 대해 설명해주세요.',
    role: 'fe',
  },
  {
    question: '클로저(Closure)에 대해 설명해주세요.',
    role: 'fe',
  },
  {
    question: '실행 컨텍스트에 대해 설명해주세요.',
    role: 'fe',
  },
  {
    question: '렉시컬 환경(Lexical Environment)에 대해 설명해주세요.',
    role: 'fe',
  },
  {
    question: '자바스크립트에서 일어나는 데이터 형변환에 대해 설명해주세요.',
    role: 'fe',
  },
  {
    question: '자바스크립트가 동적 언어인 이유는 무엇인가요?',
    role: 'fe',
  },
  {
    question: '프로토타입에 대해 설명해주세요.',
    role: 'fe',
  },
  {
    question: '깊은 복사와 얕은 복사에 대해 설명해주세요.',
    role: 'fe',
  },
  {
    question: '불변성을 유지하려면 어떻게 해야하나요?',
    role: 'fe',
  },
  {
    question: 'Blocking과 Non-Blocking에 대해 설명해주세요.',
    role: 'fe',
  },
  {
    question: '동기와 비동기에 대해 설명해주세요.',
    role: 'fe',
  },
  {
    question: 'ES6에서 새로 생긴 기능을 아는대로 말씀해주세요.',
    role: 'fe',
  },
  {
    question: 'undefined, null, undeclared를 비교해주세요.',
    role: 'fe',
  },
  {
    question:
      '자바스크립트에서 비동기 로직이 어떻게 동작하는지 설명해주세요. (이벤트 루프)',
    role: 'fe',
  },
  {
    question: '태스크 큐와 마이크로 태스트 큐에는 어떤 함수가 들어가나요?',
    role: 'fe',
  },
  {
    question: 'requestAnimationFrame에 대해 설명해주세요.',
    role: 'fe',
  },
  {
    question: '비동기적으로 실행되는 것을 동기적으로 코딩하는 방법이 있나요?',
    role: 'fe',
  },
  {
    question: 'map과 forEach, reduce에 대해 설명해주세요.',
    role: 'fe',
  },
  {
    question: '자바스크립트의 메모리 관리에 대해 아는 대로 설명해주세요',
    role: 'fe',
  },
  {
    question: '클래스에 대해 설명해주세요.',
    role: 'fe',
  },
  {
    question: '즉시 실행 함수 (IIFE)에 대해 설명해주세요.',
    role: 'fe',
  },
  {
    question: '엄격 모드에 대해 설명해주세요.',
    role: 'fe',
  },
  {
    question: '콜 스택 (Call Stack)과 힙 (Heap)에 대해 설명해주세요.',
    role: 'fe',
  },
  {
    question: 'Rest 연산자와 Spread 연산자에 대해 설명해주세요.',
    role: 'fe',
  },
  {
    question: '제너레이터에 대해 설명해주세요.',
    role: 'fe',
  },
  {
    question: '이터러블과 이터레이터 프로토콜에 대해 설명해주세요.',
    role: 'fe',
  },
  {
    question: '타입스크립트를 사용하는 이유에 대해 설명해주세요.',
    role: 'fe',
  },
  {
    question: 'Type과 Interface의 차이점에 대해 설명해주세요.',
    role: 'fe',
  },
  {
    question: '제네릭에 대해 설명해주세요.',
    role: 'fe',
  },
  {
    question: '제네릭 유틸리티 타입에 대해 설명해주세요.',
    role: 'fe',
  },
  {
    question: '클래스의 Public, Private, Protected에 대해 설명해주세요.',
    role: 'fe',
  },
  {
    question: '클래스의 Static에 대해 설명해주세요.',
    role: 'fe',
  },
];

export default questions;
