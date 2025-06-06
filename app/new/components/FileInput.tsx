'use client';

import styles from './styles/fileinput.module.css';
import Upload from '@/public/upload.svg';
import File from '@/public/file-regular.svg';
import Xmark from '@/public/xmark.svg';
import { useRef, useState } from 'react';

import { uploadPdfToServer } from '@/utils/services/pdf';
import Loading from '@/components/common/Loading';

interface FileItem {
  file: File;
  loading: boolean;
}

const FileInput = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileItems, setFileItems] = useState<FileItem[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf') {
      alert('PDF 파일만 업로드 가능합니다.');
      return;
    }

    e.target.value = '';

    const newItem = { file: selectedFile, loading: true };
    setFileItems([newItem]);

    (async () => {
      try {
        const data = await uploadPdfToServer(selectedFile);

        console.log(data.result.length);

        setFileItems([{ file: selectedFile, loading: false }]);
      } catch (err) {
        setFileItems([]);
        alert(
          '이력서에서 충분한 텍스트를 추출하지 못했습니다. 파일을 다시 확인해주세요.',
        );
      }
    })();
  };

  return (
    <div className={styles.fileUploadContainer}>
      <input
        type="file"
        accept="application/pdf"
        multiple
        ref={fileInputRef}
        onChange={handleFileChange}
        className={styles.hiddenInput}
      />
      <div
        onClick={() => fileInputRef.current?.click()}
        className={styles.fileUploadTextContainer}
      >
        <Upload />
        <p>이력서 파일을 업로드하세요</p>
        <span>PDF만 가능 (최대 5MB)</span>
      </div>
      {fileItems.length > 0 && (
        <div className={styles.fileItemContainer}>
          {fileItems.map((item, index) => (
            <div key={`${item.file.name}-${index}`} className={styles.fileItem}>
              <div className={styles.fileItemLeftContainer}>
                <File />
                <p>{item.file.name}</p>
              </div>
              {item.loading ? (
                <div className={styles.loading}>
                  <Loading size={30} color="blue" />
                </div>
              ) : (
                <button
                  onClick={() => setFileItems([])}
                  className={styles.fileRemoveButton}
                  disabled={item.loading}
                >
                  <Xmark />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileInput;
