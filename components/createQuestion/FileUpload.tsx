'use client';

import { useRef, useState } from 'react';
import styles from './styles/fileupload.module.css';
import { uploadPdfToServer } from '@/utils/services/pdf';

import { UploadIcon, LoaderCircle } from 'lucide-react';

interface FileItem {
  file: File;
  loading: boolean;
  text: string;
}

const FileUpload = ({
  handleInputChange,
}: {
  handleInputChange: (text: string) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileItem, setFileItem] = useState<FileItem | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf') {
      alert('PDF 파일만 업로드 가능합니다.');
      return;
    }

    e.target.value = '';

    const newItem = { file: selectedFile, loading: true, text: '' };
    setFileItem(newItem);

    (async () => {
      try {
        const data = await uploadPdfToServer(selectedFile);

        console.log(data.result.length);

        setFileItem({
          file: selectedFile,
          loading: false,
          text: data.result.replaceAll('\n', ''),
        });

        handleInputChange(data.result.replaceAll('\n', ''));
      } catch (err) {
        setFileItem(null);

        handleInputChange('');
        alert(
          '이력서에서 충분한 텍스트를 추출하지 못했습니다. 파일을 다시 확인해주세요.',
        );
      }
    })();
  };

  return (
    <div
      className={styles.fileUploadContainer}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        accept="application/pdf"
        multiple
        ref={fileInputRef}
        onChange={handleFileChange}
        className={styles.hiddenInput}
      />
      <div className={styles.fileUploadTextContainer}>
        {fileItem?.loading ? (
          <LoaderCircle className={styles.loading} />
        ) : (
          <UploadIcon />
        )}
        {fileItem ? (
          <p>{fileItem.file.name}</p>
        ) : (
          <p>이력서 파일을 업로드하세요</p>
        )}

        {fileItem ? (
          !fileItem.loading ? (
            <span>
              인식된 텍스트 약 {fileItem.text.length.toLocaleString()}자
            </span>
          ) : (
            <span>추출 중...</span>
          )
        ) : (
          <span>PDF만 가능 (최대 5MB)</span>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
