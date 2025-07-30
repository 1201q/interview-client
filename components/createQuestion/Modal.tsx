'use client';

import { useEffect, useState } from 'react';
import styles from './styles/modal.module.css';
import { CameraIcon, Mic, HelpCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

interface ModalProps {
  onClose?: () => void;
}

// 안내 텍스트
const WINDOWS_HELP_TEXT = [
  '설정 > 개인 정보 보호 및 보안으로 이동하세요',
  "'카메라' 및 '마이크' 섹션을 선택하세요",
  '브라우저 앱에 대한 권한을 허용하세요',
];

const MAC_HELP_TEXT = [
  '시스템 환경설정 > 보안 및 개인 정보 보호로 이동하세요',
  "'카메라' 및 '마이크' 탭을 선택하세요",
  '브라우저 앱을 체크하여 권한을 허용하세요',
];

const HELP_TEXT = [
  '주소창 왼쪽의 🔒 또는 🛡️ 아이콘을 클릭하세요',
  "카메라와 마이크 권한을 '허용'으로 변경하세요",
  "아래 '권한 재요청' 버튼을 클릭하세요",
];

const CHROME_HELP_TEXT = [
  '주소창 왼쪽의 자물쇠 아이콘을 클릭하세요',
  "'카메라' 및 '마이크' 권한을 '허용'으로 변경하세요",
  '페이지를 새로고침하세요',
];

const EDGE_HELP_TEXT = [
  '주소창 왼쪽의 자물쇠 아이콘을 클릭하세요',
  "'카메라' 및 '마이크' 권한을 '허용'으로 변경하세요",
  '페이지를 새로고침하세요',
];

const FIREFOX_HELP_TEXT = [
  '주소창 왼쪽의 방패 아이콘을 클릭하세요',
  "'권한' 섹션에서 카메라와 마이크를 허용하세요",
  '페이지를 새로고침하세요',
];

const SAFARI_HELP_TEXT = [
  'Safari 메뉴 > 환경설정을 선택하세요',
  "'웹사이트' 탭에서 '카메라' 및 '마이크'를 선택하세요",
  "현재 웹사이트를 '허용'으로 설정하세요",
];

const Modal = (props: ModalProps) => {
  const [content, setContent] = useState<'face' | 'voice' | 'help'>('face');

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className={styles.container}>
      <motion.div
        initial={{ y: 30, opacity: 0.8 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className={styles.modalContainer}
      >
        <AnimatePresence>
          {content === 'face' && (
            <FaceTest
              onClose={props.onClose}
              onHelpButtonClick={() => setContent('help')}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {content === 'help' && <Help onClose={props.onClose} />}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const FaceTest = (props: ModalProps & { onHelpButtonClick: () => void }) => {
  return (
    <>
      <button className={styles.helpButton} onClick={props.onHelpButtonClick}>
        <HelpCircle color="var(--font-gray-color)" />
      </button>
      {/* 타이틀 */}
      <div className={styles.modalTitleContainer}>
        <div className={styles.iconContainer}>
          <CameraIcon color="var(--font-blue-color)" />
        </div>
        <div className={styles.titleTextContainer}>
          <h2>얼굴 인식 테스트</h2>
          <p>카메라에 얼굴이 잘 보이도록 위치를 조정해주세요</p>
        </div>
      </div>
      {/* 내용 */}
      <motion.div className={styles.indicatorContainer}>
        <div className={styles.indicator}>
          <CameraIcon color="var(--font-blue-color)" width={17} height={17} />
          <p>얼굴 인식</p>
        </div>
        <div className={styles.line}></div>
        <div className={styles.indicator}>
          <Mic color="var(--font-blue-color)" width={15} height={15} />
          <p>음성 인식</p>
        </div>
      </motion.div>
      <motion.div className={styles.cameraContainer}>1</motion.div>
      {/* 버튼 */}
      <div className={styles.buttonContainer}>
        <button className={styles.blue}>얼굴 인식 시작</button>
        <button className={styles.default} onClick={props.onClose}>
          나중에
        </button>
      </div>
    </>
  );
};

const Help = (props: ModalProps) => {
  return (
    <>
      {/* 타이틀 */}
      <div className={styles.modalTitleContainer}>
        <div className={`${styles.iconContainer} ${styles.red}`}>
          <CameraIcon color="var(--font-red-color)" />
        </div>
        <div className={styles.titleTextContainer}>
          <h2>권한 설정 도움말</h2>
          <p>카메라와 마이크 사용을 허용하는 방법이에요</p>
        </div>
      </div>
      {/* 내용 */}

      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        className={styles.helpContainer}
      >
        <section>
          <div
            className={`${styles.infoContainer} ${styles.smallInfo} ${styles.blueInfo}`}
          >
            <p className={`${styles.title}`}>🚀 빠른 해결 방법</p>
            {HELP_TEXT.map((text, index) => (
              <div className={`${styles.infoItem}`} key={`help-${text}`}>
                <div className={styles.circle}>{index + 1}</div>
                <p className={styles.text}>{text}</p>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h3>브라우저별 상세 설정 방법</h3>
          <div className={styles.grid}>
            <div className={`${styles.infoContainer} ${styles.smallInfo}`}>
              <p className={`${styles.title}`}>🌐 Chrome</p>
              {CHROME_HELP_TEXT.map((text, index) => (
                <div className={`${styles.infoItem} `} key={`windows-${text}`}>
                  <div className={styles.circle}>{index + 1}</div>
                  <p className={styles.text}>{text}</p>
                </div>
              ))}
            </div>
            <div className={`${styles.infoContainer} ${styles.smallInfo}`}>
              <p className={`${styles.title}`}>🦊 Firefox</p>
              {FIREFOX_HELP_TEXT.map((text, index) => (
                <div className={`${styles.infoItem} `} key={`mac-${text}`}>
                  <div className={styles.circle}>{index + 1}</div>
                  <p className={styles.text}>{text}</p>
                </div>
              ))}
            </div>
            <div className={`${styles.infoContainer} ${styles.smallInfo}`}>
              <p className={`${styles.title}`}>🧭 Safari</p>
              {SAFARI_HELP_TEXT.map((text, index) => (
                <div className={`${styles.infoItem} `} key={`windows-${text}`}>
                  <div className={styles.circle}>{index + 1}</div>
                  <p className={styles.text}>{text}</p>
                </div>
              ))}
            </div>
            <div className={`${styles.infoContainer} ${styles.smallInfo}`}>
              <p className={`${styles.title}`}>🔷 Edge</p>
              {EDGE_HELP_TEXT.map((text, index) => (
                <div className={`${styles.infoItem} `} key={`mac-${text}`}>
                  <div className={styles.circle}>{index + 1}</div>
                  <p className={styles.text}>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section>
          <h3>운영체제별 권한 설정</h3>
          <div className={styles.grid}>
            <div className={`${styles.infoContainer} ${styles.smallInfo}`}>
              <p className={`${styles.title}`}>🪟 Windows</p>
              {WINDOWS_HELP_TEXT.map((text, index) => (
                <div className={`${styles.infoItem} `} key={`windows-${text}`}>
                  <div className={styles.circle}>{index + 1}</div>
                  <p className={styles.text}>{text}</p>
                </div>
              ))}
            </div>
            <div className={`${styles.infoContainer} ${styles.smallInfo}`}>
              <p className={`${styles.title}`}>🍎 macOS</p>
              {MAC_HELP_TEXT.map((text, index) => (
                <div className={`${styles.infoItem} `} key={`mac-${text}`}>
                  <div className={styles.circle}>{index + 1}</div>
                  <p className={styles.text}>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section>
          <div className={`${styles.infoContainer} ${styles.yellowInfo}`}>
            <p className={`${styles.title}`}>💡 문제 해결 팁</p>
            <ul>
              <li>
                • 다른 탭이나 애플리케이션에서 카메라/마이크를 사용 중이라면
                종료해주세요
              </li>
              <li>• 브라우저를 완전히 종료한 후 다시 시작해보세요</li>
              <li>
                • 외부 웹캠이나 마이크를 사용하는 경우 연결 상태를 확인해주세요
              </li>
            </ul>
          </div>
        </section>
      </motion.div>
      {/* 버튼 */}
      <div className={styles.buttonContainer}>
        <button className={styles.blue}>얼굴 인식 시작</button>
        <button className={styles.default} onClick={props.onClose}>
          나중에
        </button>
      </div>
    </>
  );
};

export default Modal;
