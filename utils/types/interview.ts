export type InterviewPhase =
  | 'beforeStart' // 시작 전 (버튼: 면접 시작) 누르면 인터뷰 시작
  | 'beforeStartLoading' // 시작 전 로딩 (버튼: 면접 시작 로딩) 완료되면 첫번째 질문 카운트
  | 'start' // 시작 (버튼: 시작) [타이머: 30초]
  | 'starting' // 시작 중... (버튼: 시작 로딩) [타이머: 초기화]
  | 'startCountdown3' // 3초 대기 (버튼: 3초 애니메이션)
  | 'answering' // 답변 중... (버튼: 제출하기) [타이머: 질문유형에 맞게 세팅]
  | 'submitting' // 제출 중... [타이머: pause]
  | 'submitSuccess' // 제출 성공 [타이머: 초기화]
  | 'end'; // 인터뷰 종료

export type InterviewSessionStatus =
  | 'not_started'
  | 'in_progress'
  | 'completed'
  | 'expired';

export type SessionQuestionStatus =
  | 'waiting'
  | 'ready'
  | 'answering'
  | 'submitted';

export interface SessionQuestionItem {
  id: string;
  order: number;
  type: 'main' | 'followup';
  text: string;
  status: SessionQuestionStatus;
  answer: any;
}

export interface QSessionQuestionItem extends SessionQuestionItem {
  question_id: string;
}
