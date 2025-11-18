'use client';

import { useRef, useState } from 'react';
import styles from './styles/uploader.module.css';

import Button from '@/components/shared/Button';
import { useAtom } from 'jotai';
import { resumeTextAtom } from '@/store/request-stage';
import { generateQuestion } from '@/utils/services/generateQuestion';
import { useRouter } from 'next/navigation';

const JobTextUploader = () => {
  const MAX_LENGTH = 2500;
  const MIN_LENGTH = 100;

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  const [text, setText] = useState('');

  const [resumeText] = useAtom(resumeTextAtom);

  const [submitting, setSubmitting] = useState(false);
  const nextButtonDisabled = text.length < MIN_LENGTH;
  const prevButtonDisabled = false;

  const createRequest = async () => {
    setSubmitting(true);

    const jobText = textareaRef.current?.value || '';

    console.log(jobText);
    console.log(resumeText);

    try {
      if (jobText.length < MIN_LENGTH) {
        setSubmitting(false);
        alert(`채용공고 내용을 최소 ${MIN_LENGTH}자 이상 입력해주세요.`);
        return;
      }

      const res = await generateQuestion({
        resume_text: resumeText,
        job_text: jobText,
      });

      setSubmitting(false);

      router.replace(`/new-request/${res.request_id}/generating`);
    } catch (error) {
      setSubmitting(false);
      alert('문제가 발생했어요. 다시 시도해주세요.');
    }
  };

  return (
    <>
      <div className={styles.main}>
        <p className={styles.title}>채용공고를 업로드하세요</p>
        <p className={styles.desc}>
          내가 준비하고 있는 기업의 채용공고 텍스트를 준비해주세요. 기업이
          원하는 인재상, 해당 직군이 필요로 하는 업무 등이 포함되면 좋아요.
        </p>

        <section>
          <div className={styles.textInput}>
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
              }}
              maxLength={MAX_LENGTH}
              minLength={MIN_LENGTH}
              spellCheck={false}
              placeholder="채용공고 내용을 입력하세요."
            />

            <div className={styles.textLength}>
              현재 {text.length.toLocaleString()}자 ·{' '}
              {text.length < MIN_LENGTH
                ? `최소 ${MIN_LENGTH}자 필요`
                : `최대 ${MAX_LENGTH.toLocaleString()}자 까지`}
            </div>
          </div>
        </section>
      </div>

      <div className={styles.buttons}>
        <Button
          text="이전 단계로"
          disabled={prevButtonDisabled}
          color="gray"
          onClick={() => {
            router.back();
          }}
        />
        <Button
          text="다음"
          disabled={nextButtonDisabled}
          loading={submitting}
          onClick={() => {
            createRequest();
          }}
        />
      </div>
    </>
  );
};

export default JobTextUploader;
