import { execSync } from 'child_process';
import OpenAI from 'openai';

const diff = execSync('git diff --cached', { encoding: 'utf-8' });

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const res = await client.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [
    {
      role: 'user',
      content: `다음 Git diff를 보고 Git 커밋 메시지를 작성해줘.
- 첫 줄: Gitmoji + 한국어 제목 (예: ✨ feat: 로그인 기능 추가)
- 두 번째 줄은 비워두기
- 세 번째 줄 이후: 상세 설명 (한국어, bullet point, 이모지 사용 ❌)
- 제목은 50자 이내, 본문 줄은 72자 이내로 작성
\n\n${diff}`,
    },
  ],
});

console.log(res.choices[0].message.content.trim());
