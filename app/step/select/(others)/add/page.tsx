import { QuestionType } from '@/utils/types/types';

const Page = async () => {
  const data = await fetch('https://api.aiterview.tech/oracledb');

  const res: QuestionType[] = await data.json();

  return (
    <div>
      {res.map((item) => (
        <div key={item.id}>{item.question_text}</div>
      ))}
    </div>
  );
};

export default Page;
