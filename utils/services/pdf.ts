export function uploadPdfWithProgress(
  file: File,
  onProgress?: (percent: number) => void,
): Promise<{ result: string }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const form = new FormData();

    form.append('file', file);

    xhr.open(
      'POST',
      `${process.env.NEXT_PUBLIC_API_URL}/generate-question/extract`,
    );

    xhr.upload.onprogress = (e) => {
      if (!e.lengthComputable) return;

      const percent = Math.min(99, Math.round((e.loaded / e.total) * 100));
      onProgress?.(percent);
    };

    xhr.onreadystatechange = () => {
      if (xhr.readyState !== XMLHttpRequest.DONE) return;

      try {
        const json = JSON.parse(xhr.responseText || '{}');
        if (xhr.status >= 200 && xhr.status < 300) {
          onProgress?.(100);
          resolve(json);
        } else {
          reject(new Error(json.message || 'PDF 업로드 실패'));
        }
      } catch {
        reject(new Error('서버 응답 실패'));
      }
    };

    xhr.onerror = () => {
      reject(new Error('네트워크 오류'));
    };

    xhr.send(form);
  });
}
