'use client';

import styles from './styles/container.module.css';

import Tabmenu from './TabMenu';

import { useState } from 'react';

import FileInput from './FileInput';
import TextArea from './TextArea';

const Container = () => {
  const [selected, setSelected] = useState<'file' | 'user'>('file');

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <p>정보 입력</p>
        <span>
          이력서와 채용공고 정보를 입력하여 맞춤형 면접 질문을 생성하세요.
        </span>
      </div>
      <Tabmenu
        selected={selected}
        handleClick={(menu) => {
          setSelected(menu);
        }}
      />
      <div className={styles.contentsContainer}>
        {selected === 'file' && (
          <div className={styles.section}>
            <div className={styles.menuTitleContainer}>
              <p>이력서</p>
            </div>
            <FileInput />
          </div>
        )}
        {selected === 'user' && (
          <div className={styles.section}>
            <div className={styles.menuTitleContainer}>
              <p>이력서 내용</p>
            </div>
            <TextArea
              max={2000}
              placeholder="이력서 내용을 입력하세요. 주요 경력, 기술 스택, 프로젝트 경험 등을 포함해주세요."
            />
          </div>
        )}
        <div className={styles.section}>
          <div className={styles.menuTitleContainer}>
            <p>채용공고 내용</p>
          </div>
          <TextArea
            max={1500}
            placeholder="지원하려는 회사의 채용공고 내용을 입력하세요. 직무 요구사항, 우대사항 등을 포함해주세요."
          />
        </div>
      </div>
      <button className={styles.submitButton} disabled={true}>
        맞춤형 질문 생성하기
      </button>
    </div>
  );
};

export default Container;
