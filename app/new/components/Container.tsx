'use client';

import styles from './styles/container.module.css';

import Tabmenu from './TabMenu';

import { useState } from 'react';

import FileInput from './FileInput';
import TextArea from './TextArea';
import { useAtomValue } from 'jotai';
import { uploadedFileAtom } from '@/store/resume';

interface Props {
  handleSubmitWithFile: (
    formData: FormData,
    resumeText: string,
  ) => Promise<void>;
  handleSubmitWithText: (formData: FormData) => Promise<void>;
}

const Container = ({ handleSubmitWithFile, handleSubmitWithText }: Props) => {
  const [selected, setSelected] = useState<'file' | 'user'>('file');
  const uploadedFile = useAtomValue(uploadedFileAtom);

  const [resumeTextCheck, setResumeTextCheck] = useState(false);
  const [recruitmentTextCheck, setRecruitmentTextCheck] = useState(false);

  const submitButtonDisabled = () => {
    if (selected === 'file') {
      if (uploadedFile?.loading) return false;
      if (!uploadedFile?.file) return false;
      if (uploadedFile.text.length < 100) return false;
      if (!recruitmentTextCheck) return false;

      return true;
    } else {
      if (!resumeTextCheck) return false;
      if (!recruitmentTextCheck) return false;

      return true;
    }
  };

  const handleSubmit = async (formData: FormData) => {
    if (selected === 'file') {
      if (!uploadedFile?.file) {
        alert('파일이 없습니다. 다시 확인해주세요.');
        return;
      }
      if (uploadedFile?.loading) {
        alert('파일을 변환 중입니다. 잠시 후 시도해주세요.');
        return;
      }

      handleSubmitWithFile(formData, uploadedFile.text);
    } else {
      handleSubmitWithText(formData);
    }
  };

  const handleResumeTextareaCheck = (check: boolean) => {
    setResumeTextCheck(check);
  };

  const handleRecruitmentTextareaCheck = (check: boolean) => {
    setRecruitmentTextCheck(check);
  };

  return (
    <form action={handleSubmit} className={styles.container}>
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
              unmount={() => setResumeTextCheck(false)}
              handleCheck={handleResumeTextareaCheck}
              name={'resume'}
              max={5000}
              placeholder="100자 이상, 이력서 내용을 입력하세요. 주요 경력, 기술 스택, 프로젝트 경험 등을 포함해주세요."
            />
          </div>
        )}
        <div className={styles.section}>
          <div className={styles.menuTitleContainer}>
            <p>채용공고 내용</p>
          </div>
          <TextArea
            handleCheck={handleRecruitmentTextareaCheck}
            name={'recruitment'}
            max={1000}
            placeholder="100자 이상, 지원하려는 회사의 채용공고 내용을 입력하세요. 직무 요구사항, 우대사항 등을 포함해주세요."
          />
        </div>
      </div>
      <button
        type="submit"
        className={styles.submitButton}
        disabled={!submitButtonDisabled()}
      >
        맞춤형 질문 생성하기
      </button>
    </form>
  );
};

export default Container;
