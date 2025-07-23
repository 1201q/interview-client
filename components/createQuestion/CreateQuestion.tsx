'use client';

import {
  FileTextIcon,
  BriefcaseIcon,
  FileText,
  Briefcase,
  Brain,
  Sparkles,
} from 'lucide-react';
import styles from './styles/input-question.module.css';
import loadingStyles from './styles/loading.question.module.css';

import UserInput from './UserInput';
import TextArea from './TextArea';
import FileUpload from './FileUpload';
import useCreateQuestion from './hooks/useCreateQuestion';

import { Timer, ZapIcon } from 'lucide-react';

import { motion } from 'motion/react';

const CreateQuestion = () => {
  const props = useCreateQuestion();

  if (props.stage === 'input') {
    return <InputComponent props={props} />;
  } else if (props.stage === 'loading') {
    return <LoadingComponent />;
  }
};

const LoadingComponent = () => {
  return (
    <div className={styles.createQuestionContainer}>
      <div className={styles.leftContainer}>
        <div className={loadingStyles.loadingContainer}>
          {/* 상단 로딩 원 */}
          <div className={loadingStyles.loadingCircleContainer}>
            <div className={loadingStyles.loadingCircle}>
              <motion.div
                className={loadingStyles.rotatingCircle}
                animate={{ rotate: 360 }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'linear',
                }}
              >
                <ZapIcon color="white" />
              </motion.div>
            </div>
            {[FileText, Briefcase, Brain, Sparkles].map((Icon, index) => (
              <motion.div
                key={index}
                style={{
                  top: '50%',
                  left: '50%',
                  transformOrigin: '0 0',
                  position: 'absolute',
                }}
                animate={{
                  rotate: 360,
                  x: Math.cos((index * Math.PI) / 2) * 80,
                  y: Math.sin((index * Math.PI) / 2) * 80,
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'linear',
                  delay: index * 0.5,
                }}
              >
                <div className={loadingStyles.circleItem}>
                  <Icon />
                </div>
              </motion.div>
            ))}
          </div>

          {/* 그라디언트 텍스트 */}
          <div className={loadingStyles.loadingContentsContainer}>
            <h3 className={loadingStyles.gradientText}>
              AI가 면접 질문을 생성하고 있어요
            </h3>
          </div>

          {/* 안내 텍스트  */}
          <div className={loadingStyles.loadingContentsContainer}>
            <p>
              이력서와 채용공고를 꼼꼼히 분석하여 맞춤형 면접 질문을 만들고
              있어요. 조금만 기다려 주세요.
            </p>
          </div>

          {/* 프로그레스 바 */}
          <div className={loadingStyles.loadingContentsContainer}>
            <div className={loadingStyles.progressbarContainer}>
              <div className={loadingStyles.progressbarHeaderContainer}>
                <span>진행률</span>
                <span>50%</span>
              </div>
              <div className={loadingStyles.progressbar}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${100}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className={loadingStyles.bar}
                ></motion.div>
              </div>
            </div>
          </div>

          {/* 남은 시간 */}
          <div className={loadingStyles.loadingContentsContainer}>
            <div className={loadingStyles.timeLeftContainer}>
              <Timer width={14} height={14} />
              <p>예상 분석시간 : 30초 ~ 1분</p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.rightContainer}>1</div>
    </div>
  );
};

const InputComponent = ({
  props,
}: {
  props: ReturnType<typeof useCreateQuestion>;
}) => {
  return (
    <div className={styles.createQuestionContainer}>
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

export default CreateQuestion;
