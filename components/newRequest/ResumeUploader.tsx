'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './styles/uploader.module.css';
import { FileTextIcon, ArrowUp, XIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Button from '@/components/shared/Button';
import { useAtom } from 'jotai';
import { currentRequestStageAtom, resumeTextAtom } from '@/store/request-stage';
import { uploadPdfWithProgress } from '@/utils/services/pdf';

const ResumeUploader = () => {
  const MAX_LENGTH = 8000;
  const MIN_LENGTH = 100;

  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [requestStage, setRequestStage] = useAtom(currentRequestStageAtom);
  const [resumeText, setResumeText] = useAtom(resumeTextAtom);

  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!file) return;

    setError(null);
    setUploading(true);
    setProgress(0);

    (async () => {
      try {
        const { result } = await uploadPdfWithProgress(file, (pct) => {
          setProgress(Math.min(75, pct));
        });

        const extracted = (result ?? '').trim();

        const len = extracted.length;

        if (len < MIN_LENGTH || len > MAX_LENGTH) {
          setError(
            len < MIN_LENGTH
              ? `추출된 텍스트가 너무 짧습니다. (현재 ${len}자, 최소 ${MIN_LENGTH}자 필요)`
              : `추출된 텍스트가 너무 깁니다. (현재 ${len.toLocaleString()}자, 최대 ${MAX_LENGTH.toLocaleString()}자)`,
          );

          setFile(null);
          setProgress(0);
          if (inputRef.current) inputRef.current.value = '';
          setTimeout(() => {
            setText(extracted);
            textareaRef.current?.focus();
          }, 0);

          alert(
            '이력서의 텍스트 길이가 너무 길거나, 짧습니다. 직접 입력 모드로 전환됩니다.',
          );

          return;
        }

        setResumeText(extracted);
        setProgress(100);
      } catch (error) {
        alert('PDF에 충분한 텍스트가 없습니다. 다시 시도해주세요.');
        setError('PDF 업로드에 실패했습니다. 다시 시도해주세요.');
        setFile(null);
        setProgress(0);

        if (inputRef.current) inputRef.current.value = '';

        setTimeout(() => textareaRef.current?.focus(), 260);
      } finally {
        setUploading(false);
      }
    })();
  }, [file]);

  const onPickFile = () => inputRef.current?.click();

  const onChoose: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.type !== 'application/pdf') return alert('PDF만 업로드 가능');
    if (f.size > 25 * 1024 * 1024) return alert('최대 25MB까지 업로드 가능');
    setFile(f);
    setText('');
  };

  const clearFile = () => {
    setFile(null);
    setProgress(0);
    if (inputRef.current) inputRef.current.value = '';
    setTimeout(() => textareaRef.current?.focus(), 260);
  };

  const nextStage = () => {
    if (!file && text.length >= MIN_LENGTH && text.length <= MAX_LENGTH) {
      console.log(text);
      setResumeText(text);
    }

    setRequestStage('jobText');
  };

  const showUploader = !text; // 텍스트 모드면 업로더 접기
  const showDivider = !file && !text;
  const showFile = !!file;
  const showTextarea = !file; // 항상 마운트(접기/펼치기만)

  const textInRange = text.length >= MIN_LENGTH && text.length <= MAX_LENGTH;
  const fileReady = !!file && progress >= 100;

  const canProceed = (!file && textInRange) || fileReady;

  const nextButtonDisabled = uploading || !canProceed;

  return (
    <>
      <div className={styles.main}>
        <p className={styles.title}>이력서를 업로드하세요</p>
        <p className={styles.desc}>
          PDF 업로드가 기본이며, 없다면 이력서 내용을 텍스트로 입력해도
          괜찮아요.
        </p>

        <motion.div
          layout
          transition={{ layout: { duration: 0.25, ease: [0.2, 0.6, 0.2, 1] } }}
        >
          {/* 업로더 */}
          <motion.section
            layout
            data-hidden={!showUploader}
            initial={false}
            animate={{
              opacity: showUploader ? 1 : 0,
              height: showUploader ? 'auto' : 0,
              marginTop: showUploader ? 16 : 0,
              marginBottom: showUploader ? 15 : 0,
            }}
            transition={{ duration: 0.25 }}
            style={{
              overflow: 'hidden',
              pointerEvents: showUploader ? 'auto' : 'none',
              contain: 'layout paint',
              willChange: 'height, opacity',
            }}
          >
            <div
              className={styles.uploader}
              onClick={onPickFile}
              role="button"
              tabIndex={0}
            >
              <div className={styles.uploadIcon}>
                <FileTextIcon
                  size={56}
                  strokeWidth={1}
                  fill="var(--color-primary-weak)"
                  stroke="var(--color-border)"
                />
                <div className={styles.uploadUpIcon}>
                  <ArrowUp
                    size={16}
                    strokeWidth={2.5}
                    color="var(--neutral-0)"
                  />
                </div>
              </div>
              <p className={styles.title}>이력서 파일을 업로드하세요</p>
              <p className={styles.desc}>PDF · 최대 25MB</p>
              <input
                ref={inputRef}
                type="file"
                hidden
                accept="application/pdf"
                onChange={onChoose}
              />
            </div>
          </motion.section>

          {/* Divider (있을 때만 렌더) */}
          <AnimatePresence>
            {showDivider && (
              <motion.div
                key="divider"
                className={styles.divider}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <span>또는 직접 입력하기</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 파일 업로드 상태 — 언마운트하지 않고 접기/펼치기 */}
          <motion.section
            layout
            data-hidden={!showFile}
            initial={false}
            animate={{
              opacity: showFile ? 1 : 0,
              height: showFile ? 'auto' : 0,
              marginTop: showFile ? 16 : 0,
              marginBottom: showFile ? 15 : 0,
            }}
            transition={{ duration: 0.25 }}
            style={{
              overflow: 'hidden',
              pointerEvents: showFile ? 'auto' : 'none',
              contain: 'layout paint',
              willChange: 'height, opacity',
              // 제발 부드럽게 돌아가줄래?
            }}
          >
            <p className={styles.contentTitle}>PDF 업로드</p>
            <div className={styles.uploadItem}>
              <button
                className={styles.itemRemoveButton}
                onClick={clearFile}
                aria-label="파일 삭제"
              >
                <XIcon size={16} />
              </button>
              <div className={styles.itemTop}>
                <div className={styles.itemIcon}>PDF</div>
                <div className={styles.itemText}>
                  <p className={styles.itemName}>{file?.name}</p>
                  <p className={styles.itemDesc}>
                    {progress < 100
                      ? `업로드 중… ${progress.toFixed(0)}%`
                      : `완료. ${resumeText.length.toLocaleString()}자 추출됨`}
                  </p>
                </div>
              </div>
              <div className={styles.itemBar} aria-hidden="true">
                <motion.div
                  className={styles.bar}
                  animate={{ transform: `translateX(${progress}%)` }}
                  transition={{ type: 'tween', duration: 0.2 }}
                />
              </div>
            </div>
          </motion.section>

          {/* 텍스트 입력 — 항상 마운트(포커스 유지), 접기/펼치기 */}
          <motion.section
            layout
            data-hidden={!showTextarea}
            initial={false}
            animate={{
              opacity: showTextarea ? 1 : 0,
              height: showTextarea ? 'auto' : 0,
              marginTop: showTextarea ? 16 : 0,
              marginBottom: showTextarea ? 15 : 0,
            }}
            transition={{ duration: 0.25 }}
            style={{
              overflow: 'hidden',
              pointerEvents: showTextarea ? 'auto' : 'none',
              contain: 'layout paint',
              willChange: 'height, opacity',
            }}
          >
            <div className={styles.textInput}>
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  if (e.target.value.length && file) setFile(null);
                }}
                maxLength={MAX_LENGTH}
                minLength={MIN_LENGTH}
                placeholder="이력서 내용을 입력하세요."
                spellCheck={false}
              />
              {text.length > 0 && (
                <div className={styles.textLength}>
                  현재 {text.length.toLocaleString()}자 ·{' '}
                  {text.length < MIN_LENGTH
                    ? `최소 ${MIN_LENGTH}자 필요`
                    : `최대 ${MAX_LENGTH.toLocaleString()}자 까지`}
                </div>
              )}
            </div>
          </motion.section>
        </motion.div>
      </div>
      <div className={styles.buttons}>
        <Button text="다음" disabled={nextButtonDisabled} onClick={nextStage} />
      </div>
    </>
  );
};

export default ResumeUploader;
