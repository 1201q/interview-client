'use server';

import { redirect } from 'next/navigation';

type Status = 'pending' | 'working' | 'completed' | 'failed';

export async function generateQuestionsFromResume(
  resumeText: string,
  recruitmentText: string,
) {
  if (recruitmentText.length < 100) {
    throw new Error('채용공고를 100자 이상으로 작성했는지 다시 확인해주세요.');
  }

  if (recruitmentText.length > 1000) {
    throw new Error('채용공고를 1000자 미만으로 작성했는지 다시 확인해주세요.');
  }

  if (resumeText.length < 100) {
    throw new Error('이력서를 100자 이상으로 작성했는지 다시 확인해주세요.');
  }

  if (resumeText.length > 10000) {
    throw new Error('이력서를 10000자 미만으로 작성했는지 다시 확인해주세요.');
  }

  const body = JSON.stringify({
    resume_text: resumeText,
    recruitment_text: recruitmentText,
  });

  console.log(body);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/question/generate/new`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body,
    },
  );

  if (!res.ok) {
    throw new Error('질문 생성에 실패했습니다. 다시 시도해주세요.');
  }

  const data: { id: string; status: Status } = await res.json();

  if (data.status === 'completed') {
    redirect(`/new/result/${data.id}`);
  } else {
    throw new Error('질문 생성에 실패했습니다. 다시 시도해주세요.');
  }
}
