'use server';

export const deleteUserQuestions = async (
  token: string,
  question: string[],
) => {
  if (question.length === 0) {
    throw new Error('없습니다.');
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/question/delete/user`,
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

    return { success: true };
  } catch (error) {
    console.error(error);

    return { success: false };
  }
};
