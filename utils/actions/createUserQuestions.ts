interface SubmitQuestions {
  question_text: string;
  role: 'user';
}

export const createUserQuestions = async (
  token: string,
  question: SubmitQuestions[],
) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/question/add/user`,
      {
        method: 'POST',
        credentials: 'include',

        headers: {
          'Content-Type': 'application/json',
          Cookie: `accessToken=${token}`,
        },
        body: JSON.stringify({ items: question }),
      },
    );

    if (!response.ok) {
      throw new Error('로그아웃에 실패했습니다.');
    }
  } catch (error) {
    console.error(error);
  }
};
