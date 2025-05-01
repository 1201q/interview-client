export const uploadAudioForSTT = async (audioBlob: Blob): Promise<string> => {
  const formData = new FormData();
  formData.append('file', audioBlob, 'audio.webm');

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/stt/upload`,
    {
      method: 'POST',
      body: formData,
    },
  );

  if (!response.ok) {
    throw new Error('STT 실패');
  }

  const data = await response.json();
  return data.text;
};
