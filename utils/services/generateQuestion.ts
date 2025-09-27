interface GenerateQuestionPayload {
  resume_text: string;
  job_text: string;
}

export const generateQuestion = async (payload: GenerateQuestionPayload) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/generate-question/new`,
    {
      method: 'POST',
      credentials: 'include',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw new Error('생성 실패');
  }

  const data: { id: string; status: string } = await response.json();

  return data;
};
