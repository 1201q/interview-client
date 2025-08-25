'use client';

import { useAtom, useSetAtom } from 'jotai';
import styles from './styles/interview-init.module.css';
import {
  InterviewInitAtom,
  InterviewJobRoleAtom,
  KeywordsForSttAtom,
  SessionQuestionsAtom,
} from '@/store/interviewSession';
import { useCallback, useEffect, useRef } from 'react';
import {
  createInterviewJobRole,
  createInterviewSession,
  createInterviewSttKeywords,
  getInterviewSessionDetail,
} from '@/utils/services/interviewSession';

interface InitProps {
  sessionId: string;
}

const InterviewInit = ({ sessionId }: InitProps) => {
  const [interviewInit, setInterviewInit] = useAtom(InterviewInitAtom);
  const setJobRole = useSetAtom(InterviewJobRoleAtom);
  const setKeywords = useSetAtom(KeywordsForSttAtom);
  const setQuestions = useSetAtom(SessionQuestionsAtom);

  const startedRef = useRef(false); // false일 경우, 실행
  const mountedRef = useRef(true); // true인 경우만 값을 반영함. false일 경우 값 반영 x

  const init = useCallback(async () => {
    if (startedRef.current) return;
    startedRef.current = true;

    setInterviewInit('loading');

    try {
      const [detail, jobRole, keywords] = await Promise.all([
        getInterviewSessionDetail(sessionId),
        createInterviewJobRole(sessionId),
        createInterviewSttKeywords(sessionId),
      ]);

      if (!mountedRef.current) return;

      setQuestions(detail.questions ?? []);
      setJobRole(jobRole.job_role ?? '');
      setKeywords(keywords.keywords ?? []);

      setInterviewInit('completed');

      console.log(detail, jobRole, keywords);
    } catch (error) {
      if (!mountedRef.current) return;

      console.error('interviewInit error', error);
      setInterviewInit('error');
    }
  }, [sessionId, setInterviewInit, setJobRole, setKeywords, setQuestions]);

  useEffect(() => {
    mountedRef.current = true;

    init();

    return () => {
      mountedRef.current = false;
      startedRef.current = false;
    };
  }, [init]);

  return (
    <div className={styles.selectLoadingContainer}>
      <div
        style={{ position: 'fixed', backgroundColor: 'white', top: 0, left: 0 }}
      >
        <div>{interviewInit}</div>
      </div>
      <div className={styles.contetnsContainer}>
        <p className={styles.text}>면접 세팅 중입니다</p>
      </div>
    </div>
  );
};

export default InterviewInit;
