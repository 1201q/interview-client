'use client';

import { FileTextIcon, BriefcaseIcon } from 'lucide-react';
import styles from './styles/container.module.css';
import UserInput from '@/components/beforeInterview/inputPage/UserInput';
import TextArea from '@/components/beforeInterview/inputPage/TextArea';
import FileUpload from '@/components/beforeInterview/inputPage/FileUpload';
import useCreateQuestion from '@/utils/hooks/useCreateQuestion';
import { Variants, motion } from 'motion/react';
import Button from '../shared/Button';

// 등장 애니메이션
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // 자식간
      delayChildren: 0.1, // 첫 자식 시작까지 딜레이
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 1, stiffness: 100, type: 'spring' },
  },
};

const InputPage = ({
  props,
}: {
  props: ReturnType<typeof useCreateQuestion>;
}) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={styles.container}
    >
      <div
        className={styles.leftContainer}
        style={{ justifyContent: 'center' }}
      >
        <motion.h1 variants={itemVariants}>AI 면접, 시작해볼까요?</motion.h1>
        <motion.p variants={itemVariants}>
          이력서와 채용 공고를 올려주시면, AI가 맞춤형 면접 질문을 생성해
          드립니다. 실제 면접처럼 연습하고 자신감을 키워보세요.
        </motion.p>
      </div>
      <form onSubmit={props.onSubmit} className={styles.rightContainer}>
        <motion.div variants={itemVariants}>
          <UserInput
            titleText="이력서"
            subText="PDF 파일 (5MB 이하)"
            icon={<FileTextIcon />}
          >
            {<FileUpload handleInputChange={props.handleResumeInputChange} />}
          </UserInput>
        </motion.div>
        <motion.div variants={itemVariants}>
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
        </motion.div>
        <motion.div variants={itemVariants}>
          <Button text="면접 질문 생성" attributes={{ type: 'submit' }} />
        </motion.div>
      </form>
    </motion.div>
  );
};

export default InputPage;
