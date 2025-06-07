'use server';

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

  if (resumeText.length > 5000) {
    throw new Error('이력서를 5000자 미만으로 작성했는지 다시 확인해주세요.');
  }

  await new Promise((resolve) => setTimeout(resolve, 30000));
}
