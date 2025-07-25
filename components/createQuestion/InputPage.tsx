'use client';

import { FileTextIcon, BriefcaseIcon } from 'lucide-react';
import styles from './styles/container.module.css';
import UserInput from './UserInput';
import TextArea from './TextArea';
import FileUpload from './FileUpload';
import useCreateQuestion from './hooks/useCreateQuestion';

const InputPage = ({
  props,
}: {
  props: ReturnType<typeof useCreateQuestion>;
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.leftContainer}>
        <h1>AI 면접, 시작해볼까요?</h1>
        <p>
          이력서와 채용 공고를 올려주시면, AI가 맞춤형 면접 질문을 생성해
          드립니다. 실제 면접처럼 연습하고 자신감을 키워보세요.
        </p>
      </div>
      <form onSubmit={props.onSubmit} className={styles.rightContainer}>
        <UserInput
          titleText="이력서"
          subText="PDF 파일 (5MB 이하)"
          icon={<FileTextIcon />}
        >
          {<FileUpload handleInputChange={props.handleResumeInputChange} />}
        </UserInput>
        <UserInput
          titleText="채용공고"
          subText="공고 내용이 담긴 텍스트"
          icon={<BriefcaseIcon />}
        >
          <TextArea
            placeholder="100자 이상으로 지원하려는 회사의 채용공고 내용을 입력하세요. 직무 요구사항, 우대사항 등을 포함해주세요."
            textAreaName="job"
            handleInputChange={props.handleJobInputChange}
          />
        </UserInput>
        <div className={styles.buttonContainer}>
          <button type="submit" disabled={props.buttonDisabled}>
            면접 질문 생성
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputPage;
