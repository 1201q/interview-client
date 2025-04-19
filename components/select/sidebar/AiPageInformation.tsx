'use client';

import { useAtomValue } from 'jotai';
import styles from './aipage.module.css';
import { helpInformationAtom } from '@/store/select';

const AiPageInformation = () => {
  const information = useAtomValue(helpInformationAtom);

  return (
    <div className={styles.container}>
      <div className={styles.modalBox}>
        <p className={styles.titleText}>📘 개념 설명형</p>
        <p className={styles.explainText}>정의와 원리 설명에 중심</p>
        <ul className={styles.question}>
          <li>1. REST API란 무엇이며, 어떻게 동작하나요?</li>
          <li>2. 비동기 처리와 동기 처리의 개념을 설명하세요.</li>
          <li>3. 클로저(Closure)란 무엇인가요?</li>
        </ul>

        <p className={styles.titleText}>🛠️ 구현 문제형</p>
        <p className={styles.explainText}>기능 구현을 위한 로직에 대해 설명</p>
        <ul className={styles.question}>
          <li>1. JavaScript로 debounce 함수를 구현하는 방법은?</li>
          <li>2. 이진 탐색 트리를 재귀로 순회하는 방법에 대해 설명해주세요.</li>
        </ul>

        <p className={styles.titleText}>⚖️ 비교 설명형</p>
        <p className={styles.explainText}>두 개념의 차이</p>
        <ul className={styles.question}>
          <li>1. REST와 GraphQL의 차이점을 설명해주세요.</li>
          <li>2. 세션 기반 인증과 토큰 기반 인증의 차이를 설명해주세요.</li>
        </ul>

        <p className={styles.titleText}>📦 시스템 설계형</p>
        <p className={styles.explainText}>가상의 시스템 구조의 설계</p>
        <ul className={styles.question}>
          <li>
            1. 로그인 서비스에서 보안과 성능을 고려한 설계를 설명해주세요.
          </li>
          <li>
            2. 실시간 알림 시스템을 설계해야 한다면 어떻게 구성하시겠어요?
          </li>
        </ul>

        <p className={styles.titleText}>📍 상황/경험형</p>
        <p className={styles.explainText}>자신의 경험을 기반으로 하는 질문</p>
        <ul className={styles.question}>
          <li>
            1. 새로운 기술 도입에 반대하는 팀원이 있다면 어떻게 하시겠습니까?
          </li>
          <li>2. 성능 이슈를 발견하고 해결했던 경험을 설명해주세요.</li>
          <li>
            3. 팀원과의 갈등을 슬기롭게 해결했던 경험에 대해 소개해주세요.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AiPageInformation;
