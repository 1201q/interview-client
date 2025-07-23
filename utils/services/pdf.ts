export const uploadPdfToServer = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/generate-request/extract`,
    {
      method: 'POST',

      body: formData,
    },
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'PDF 업로드 실패');
  }

  const data: { result: string } = await res.json();

  return data;
};
