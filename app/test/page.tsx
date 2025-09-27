'use client';

import React, { useMemo, useState } from 'react';

// 간단한 타입 정의
export type Question = {
  id: string;
  text: string;
  based_on?: string;
  section: 'basic' | 'experience' | 'job_related' | 'expertise';
};

// 샘플 질문 목록(네트워크 실패 시/테스트용)
const SAMPLE_QUESTIONS: Question[] = [
  {
    id: '99e14fbe-1877-400c-8c67-0aed11bbe6e1',
    text: '도토리 서비스의 슬로우 쿼리(페이징 조회) 문제를 개선하셨다고 했는데, 해당 이슈를 발견하게 된 계기와 개선 과정에서 가장 신경 썼던 부분, 그리고 만약 성능 개선이 기대에 미치지 않았다면 어떤 추가적인 시도를 했을지 말씀해 주세요.',
    based_on:
      "이력서의 '슬로우 쿼리 개선, Indexing' 경험과 '커버링 인덱스, 프로젝션을 통해 성능을 개선'했다는 내용을 참고합니다.",
    section: 'experience',
  },
  {
    id: '28a1449b-26f6-4d0e-998c-8019376bef6a',
    text: '예약 시스템에서 발생한 동시성 문제를 Redis와 Redisson을 이용해 해결하셨다고 했습니다. 그 과정에서 예상 외의 장애나 데이터 불일치가 발생했던 경험이 있다면, 어떻게 대응하셨는지 구체적으로 말씀해 주세요.',
    based_on:
      "이력서의 '예약 시스템 동시성문제 해결', 'Redis Client Redisson을 통해 분산락을 구현'한 경험을 근거로 작성합니다.",
    section: 'experience',
  },
  {
    id: 'aa27655b-f3ec-4d28-918e-49c41bf0ab3c',
    text: 'AWS 인스턴스 매니저를 Shell Script로 개발하여 비용 절감에 기여하셨다고 했는데, 실제로 이 솔루션을 적용하면서 예상치 못한 장애나 운영상 이슈가 있었는지, 있었다면 그 이슈를 어떻게 해결하셨나요?',
    based_on:
      "이력서의 'AWS 인스턴스 매니저 개발', '서버 비용을 38% 절감'한 경험을 바탕으로 작성합니다.",
    section: 'experience',
  },
];

// 샘플 전사(테스트용 버튼으로 채우기)
const SAMPLE_TRANSCRIPT =
  '음, GAuth에서 저는 OAuth 플로우 설계할 때 처음에는 단순화를 위해 모든 클라이언트에 Implicit flow를 적용했어요. (아, 근데) 이유는 학생 앱에서 토큰을 바로 받아서 화면 전환 UX가 빠르기 때문이었고, 서버 부담도 줄어들었거든요. 그래서 초기 릴리스에서는 클라이언트가 토큰을 로컬스토리지에 보관하도록 했습니다.  그런데 보안 검토 중에 리스크가 커서 곧바로 전략을 바꿨습니다. 내부적으로는 Authorization Code + PKCE로 전환하고, 클라이언트에는 토큰을 저장하지 않게 하고 대신 서버에서만 관리하도록 했습니다. 그래서 결국엔 토큰을 로컬에 두지 않고, 모든 세션 상태를 서버에 보관하게 했습니다.  (중요한 결정이요?) 네, 그래서 결국엔 클라이언트에 토큰을 남기는 방식을 유지했고, 동시에 서버에서만 토큰을 관리하는 방식도 동시에 적용했습니다. 이게, 음, 보안과 UX 사이의 절충안이었어요.  결과적으로는 로그인 실패가 줄고(아마도), 보안 문제에 대한 대응도 개선됐다... 라고 보고 받고 있습니다. 근데, 사실 초기 설계와 최종 구현이 조금 달라서, 그 부분은 팀 내에서 정리 중이었습니다.';

// 페이지 컴포넌트
export default function EvaluationTestPage() {
  // 엔드포인트 설정(프로젝트에 맞게 변경하세요)
  const [baseUrl, setBaseUrl] = useState(process.env.NEXT_PUBLIC_API_URL);
  const [questionsPath, setQuestionsPath] = useState('/generate-question');
  const [evaluatePath, setEvaluatePath] = useState('/analyze');

  // 상태
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQ, setLoadingQ] = useState(false);
  const [errorQ, setErrorQ] = useState<string | null>(null);

  const [selectedId, setSelectedId] = useState<string>('');
  const selected = useMemo(
    () => questions.find((q) => q.id === selectedId) || null,
    [questions, selectedId],
  );

  const [transcript, setTranscript] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [responseJson, setResponseJson] = useState<any>(null);

  // 질문 불러오기
  async function loadQuestions() {
    setLoadingQ(true);
    setErrorQ(null);

    try {
      const res = await fetch(
        `${baseUrl}${questionsPath}/${'4e88866e-2a7a-4e66-b49f-12a29e67109e'}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { questions: Question[] } | Question[];
      const list = Array.isArray(data) ? data : data.questions;
      if (!Array.isArray(list)) throw new Error('Invalid questions payload');
      setQuestions(list);
      if (list.length && !selectedId) setSelectedId(list[0].id);
    } catch (err: any) {
      console.warn('질문 API 실패, 샘플 사용:', err?.message);
      setErrorQ('질문 API 호출 실패 — 샘플 데이터를 표시합니다.');
      setQuestions(SAMPLE_QUESTIONS);
      if (!selectedId) setSelectedId(SAMPLE_QUESTIONS[0].id);
    } finally {
      setLoadingQ(false);
    }
  }

  // 제출
  async function submit() {
    setSubmitting(true);
    setSubmitError(null);
    setResponseJson(null);
    try {
      if (!selected) throw new Error('질문을 선택해주세요.');
      if (!transcript.trim()) throw new Error('transcript가 비어있습니다.');

      const body = {
        questionText: selected.text,
        section: selected.section,
        transcript,
      };

      // Dry-run(테스트 케이스) — 실제 요청 전 바디 확인
      console.log('요청 바디 미리보기', body);

      const res = await fetch(`${baseUrl}${evaluatePath}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setResponseJson(data);
    } catch (err: any) {
      setSubmitError(err?.message || '요청 실패');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container">
      {/* 헤더 */}
      <header className="header">
        <div className="inner">
          <h1 className="title">평가 테스트 페이지</h1>
          <p className="subtitle">
            질문 API에서 항목을 선택하고, transcript를 입력/붙여넣기 후
            제출하세요. 결과는 하단에 표시됩니다.
          </p>
        </div>
      </header>

      <main className="grid">
        {/* 좌측: 설정/질문 목록 */}
        <section className="col">
          <div className="card">
            <h2 className="cardTitle">엔드포인트 설정</h2>
            <div className="stack">
              <label className="label">Base URL</label>
              <input
                className="input"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="http://localhost:3000"
              />
              <label className="label">Questions Path (GET)</label>
              <input
                className="input"
                value={questionsPath}
                onChange={(e) => setQuestionsPath(e.target.value)}
                placeholder="/api/questions"
              />
              <label className="label">Evaluate Path (POST)</label>
              <input
                className="input"
                value={evaluatePath}
                onChange={(e) => setEvaluatePath(e.target.value)}
                placeholder="/api/evaluate"
              />
              <div className="row">
                <button
                  onClick={loadQuestions}
                  className="btnPrimary"
                  disabled={loadingQ}
                >
                  {loadingQ ? '불러오는 중…' : '질문 불러오기'}
                </button>
                <button
                  onClick={() => {
                    setQuestions(SAMPLE_QUESTIONS);
                    if (!selectedId) setSelectedId(SAMPLE_QUESTIONS[0].id);
                  }}
                  className="btn"
                >
                  샘플 사용
                </button>
              </div>
              {errorQ && <p className="warnText">{errorQ}</p>}
            </div>
          </div>

          <div className="card">
            <h2 className="cardTitle">질문 목록</h2>
            <div className="list">
              {questions.map((q) => (
                <label key={q.id} className="listItem">
                  <input
                    type="radio"
                    name="q"
                    value={q.id}
                    checked={selectedId === q.id}
                    onChange={() => setSelectedId(q.id)}
                    className="radio"
                  />
                  <div>
                    <p className="itemTitle">{q.text}</p>
                    <p className="itemSub">
                      섹션: {q.section}
                      {q.based_on ? ' · 근거: ' + q.based_on : ''}
                    </p>
                  </div>
                </label>
              ))}
              {questions.length === 0 && (
                <p className="muted">
                  아직 질문이 없습니다. 위에서 API를 호출하거나 샘플을
                  사용하세요.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* 우측: transcript / 제출 / 결과 */}
        <section className="col">
          <div className="card">
            <h2 className="cardTitle">Transcript</h2>
            <div className="row small">
              <span>선택된 질문: </span>
              <span className="truncate strong">
                {selected ? selected.text : '—'}
              </span>
              <span className="pill">{selected ? selected.section : '—'}</span>
            </div>
            <textarea
              className="textarea"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="여기에 전사를 붙여넣으세요"
            />
            <div className="row">
              <button
                onClick={() => setTranscript(SAMPLE_TRANSCRIPT)}
                className="btn"
              >
                샘플 전사 붙여넣기
              </button>
              <button
                onClick={() => navigator.clipboard?.writeText(transcript)}
                className="btn"
              >
                현재 전사 복사
              </button>
              <button onClick={() => setTranscript('')} className="btn">
                지우기
              </button>
            </div>
          </div>

          <section className="col">
            <div className="card">
              <h2 className="cardTitle">제출</h2>
              <div className="row">
                <button
                  onClick={submit}
                  disabled={submitting || !selected || !transcript.trim()}
                  className="btnPrimary"
                >
                  {submitting ? '제출 중…' : '평가 요청 보내기'}
                </button>
                <span className="hint">POST {evaluatePath}</span>
                <button
                  onClick={() => setResponseJson(SAMPLE_EVAL_RESPONSE)}
                  className="btn"
                  title="샘플 응답을 주입합니다."
                >
                  샘플 평가 응답 붙여넣기
                </button>
              </div>
              {submitError && <p className="errorText">{submitError}</p>}
            </div>
          </section>
        </section>
      </main>
      {/* ▼▼▼ 평가 UI: 평가 응답이 존재할 때 아래에 표시 ▼▼▼ */}
      {responseJson && (
        <div className="card">
          <h2 className="cardTitle">평가 결과</h2>
          <EvaluationUI data={responseJson} transcript={transcript} />
        </div>
      )}
      <footer className="footer">
        <div className="inner">
          <p className="hint">
            Tip: CORS/인증이 필요한 경우, 브라우저 콘솔 에러를 확인하세요.
            필요한 헤더나 토큰이 있다면 알려주시면 바로 반영해 드릴게요.
          </p>
        </div>
      </footer>

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* CSS (Tailwind 제거, 순수 CSS) */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      <style>{`
         :root { --border: #e5e7eb; --muted: #6b7280; --bg: #f8fafc; --card: #ffffff; --text: #0f172a; --blue: #2563eb; --amber:#b45309; --green:#059669; }
        * { box-sizing: border-box; }
        body { margin: 0; }
        .container { min-height: 100vh; background: linear-gradient(to bottom, var(--bg) 0%, #fff 100%); color: var(--text); font-family: system-ui, -apple-system, Segoe UI, Roboto, 'Noto Sans KR', Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'; }
        .header { position: sticky; top: 0; z-index: 10; border-bottom: 1px solid rgba(0,0,0,0.08); background: rgba(255,255,255,0.85); backdrop-filter: blur(6px); }
        .inner { max-width: 1100px; margin: 0 auto; padding: 16px 20px; }
        .title { margin: 0; font-size: 18px; font-weight: 600; }
        .subtitle { margin: 6px 0 0; font-size: 13px; color: var(--muted); }

        .grid { max-width: 1100px; margin: 0 auto; padding: 24px 20px; display: grid; grid-template-columns: 1fr; gap: 24px; }
        @media (min-width: 1024px) { .grid { grid-template-columns: 0.95fr 1.05fr; } }
        .col { display: flex; flex-direction: column; gap: 16px; }

        .card { background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 16px; box-shadow: 0 1px 2px rgba(0,0,0,0.04); }
        .cardTitle { margin: 0 0 10px; font-size: 14px; font-weight: 600; }
        .stack { display: flex; flex-direction: column; gap: 8px; }
        .row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .row.small { font-size: 12px; color: var(--muted); }

        .label { font-size: 12px; color: var(--muted); }
        .input { width: 100%; border: 1px solid var(--border); border-radius: 10px; padding: 10px 12px; font-size: 14px; }
        .textarea { width: 100%; height: 190px; border: 1px solid var(--border); border-radius: 12px; padding: 12px; font-size: 14px; resize: vertical; }
        .pre { max-height: 420px; overflow: auto; background: #f1f5f9; padding: 12px; border-radius: 10px; font-size: 12px; line-height: 1.6; color: #0f172a; }

        .btn { border: 1px solid var(--border); background: #fff; border-radius: 10px; padding: 8px 12px; font-size: 14px; cursor: pointer; }
        .btn:hover { background: #f8fafc; }
        .btnPrimary { border: 0; background: var(--blue); color: #fff; border-radius: 10px; padding: 10px 14px; font-size: 14px; cursor: pointer; }
        .btnPrimary:disabled { opacity: .5; cursor: not-allowed; }

        .warnText { margin: 8px 0 0; font-size: 12px; color: #b45309; }
        .errorText { margin: 8px 0 0; font-size: 12px; color: #dc2626; }
        .hint { font-size: 12px; color: var(--muted); }
        .muted { font-size: 14px; color: var(--muted); }

        .list { max-height: 360px; overflow: auto; padding-right: 4px; display: flex; flex-direction: column; gap: 10px; }
        .listItem { display: flex; gap: 12px; padding: 12px; border: 1px solid var(--border); border-radius: 14px; cursor: pointer; }
        .listItem:hover { background: #f8fafc; }
        .radio { margin-top: 2px; }
        .itemTitle { margin: 0; font-size: 14px; font-weight: 500; }
        .itemSub { margin: 6px 0 0; font-size: 12px; color: var(--muted); }
        .truncate { display: inline-block; max-width: 420px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
        .strong { font-weight: 600; color: #1f2937; }
        .pill { display: inline-block; padding: 3px 8px; border-radius: 999px; background: #f3f4f6; font-size: 12px; color: #374151; }

        /* ---- Evaluation UI ---- */
        .eval { display: grid; grid-template-columns: 1fr; gap: 16px; }
        @media (min-width: 900px) { .eval { grid-template-columns: 0.9fr 1.1fr; } }
        .gaugeWrap { display:flex; align-items:center; gap: 14px; }
        .gauge { position: relative; width: 96px; height: 96px; border-radius: 50%; }
        .gaugeInner { position:absolute; inset:8px; background:#fff; border-radius:50%; box-shadow: inset 0 0 0 1px var(--border); display:flex; align-items:center; justify-content:center; }
        .gaugeValue { font-weight:700; font-size:18px; }
        .scoreNote { font-size: 12px; color: var(--muted); }

        .metrics { display:grid; grid-template-columns: repeat(2, 1fr); gap:10px; }
        @media (min-width: 600px) { .metrics { grid-template-columns: repeat(3, 1fr); } }
        .metric { border:1px solid var(--border); border-radius:10px; padding:10px; }
        .metricLabel { font-size:12px; color:var(--muted); display:flex; justify-content:space-between; }
        .bar { margin-top:6px; height:8px; background:#eef2f7; border-radius:999px; overflow:hidden; }
        .barFill { height:100%; background: var(--blue); }

        .flags { display:flex; flex-wrap:wrap; gap:8px; }
        .flag { border:1px solid var(--border); padding:4px 8px; border-radius:999px; font-size:12px; }
        .flag.ok { background:#ecfdf5; color:var(--green); border-color:#a7f3d0; }
        .flag.bad { background:#fff7ed; color:var(--amber); border-color:#fed7aa; }

        .sumGrid { display:grid; grid-template-columns:1fr; gap:10px; }
        @media (min-width: 700px) { .sumGrid { grid-template-columns:1fr 1fr; } }
        .sumCard { border:1px solid var(--border); border-radius:12px; padding:12px; }
        .axisBadge { display:inline-block; padding:2px 8px; border-radius:999px; background:#eff6ff; color:#1d4ed8; font-size:12px; margin-bottom:6px; }
        .sumText { margin:6px 0; font-size:14px; }
        .sumMeta { font-size:12px; color:var(--muted); }
        .chips { margin-top:8px; display:flex; gap:6px; flex-wrap:wrap; }
        .chip { font-size:12px; padding:3px 8px; border-radius:999px; border:1px solid #fde68a; background:#fffbeb; color:#92400e; }

        .narr { font-size:14px; line-height:1.7; color:#0f172a; background:#f8fafc; border:1px solid var(--border); border-radius:12px; padding:12px; }
      `}</style>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────────
// ▼ 평가 UI 컴포넌트 & 샘플 응답 (테스트 케이스)
// ───────────────────────────────────────────────────────────────────────────────

type EvalData = {
  metrics: Record<string, number>;
  summary_sentences?: {
    text: string;
    axis?: string;
    intent?: string;
    criterion?: string;
    evidence?: string[];
  }[];
  narrative_long?: string;
  flags?: Record<string, boolean>;
  ccs?: number;
  total?: number;
};

function clamp(n: number, min = 0, max = 5) {
  return Math.max(min, Math.min(max, n));
}
function pct(v: number, max = 5) {
  return (clamp(v) / max) * 100;
}

function EvaluationUI({
  data,
  transcript,
}: {
  data: EvalData;
  transcript?: string;
}) {
  const total =
    typeof data.total === 'number'
      ? data.total
      : Math.round((data.ccs ?? 0) * 20);
  const ccs =
    typeof data.ccs === 'number'
      ? data.ccs
      : Math.round((total / 20) * 10) / 10;
  const flags = data.flags || {};
  const metricsEntries = Object.entries(data.metrics || {});

  return (
    <div className="eval">
      {/* 왼쪽: 점수/플래그 */}
      <div>
        <div className="gaugeWrap">
          <Gauge value={total} />
          <div>
            <div className="title" style={{ fontSize: 16 }}>
              CCS {ccs.toFixed(1)} / 5.0
            </div>
            <div className="scoreNote">총점(0~100): {total}</div>
          </div>
        </div>
        <div style={{ marginTop: 12 }} className="flags">
          {Object.keys(flags).length === 0 && (
            <span className="flag ok">치명 플래그 없음</span>
          )}
          {Object.entries(flags).map(([k, v]) => (
            <span key={k} className={`flag ${v ? 'bad' : 'ok'}`}>
              {k}: {v ? '있음' : '없음'}
            </span>
          ))}
        </div>
        <div style={{ marginTop: 16 }} className="metrics">
          {metricsEntries.map(([k, v]) => (
            <div className="metric" key={k}>
              <div className="metricLabel">
                <span>{k}</span>
                <span>{clamp(v).toFixed(1)} / 5</span>
              </div>
              <div className="bar">
                <div className="barFill" style={{ width: pct(v) + '%' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 오른쪽: summary + narrative */}
      <div>
        {Array.isArray(data.summary_sentences) &&
          data.summary_sentences.length > 0 && (
            <div className="sumGrid">
              {data.summary_sentences.map((s, i) => (
                <div className="sumCard" key={i}>
                  <div className="axisBadge">{s.axis || '—'}</div>
                  <div className="sumText">{s.text}</div>
                  {(s.intent || s.criterion) && (
                    <div className="sumMeta">
                      {s.intent ? `의도: ${s.intent}` : ''}
                      {s.intent && s.criterion ? ' · ' : ''}
                      {s.criterion ? `기준: ${s.criterion}` : ''}
                    </div>
                  )}
                  {Array.isArray(s.evidence) && s.evidence.length > 0 && (
                    <div className="chips">
                      {s.evidence.map((e, j) => (
                        <span key={j} className="chip">
                          {e}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        {data.narrative_long && (
          <div style={{ marginTop: 16 }} className="narr">
            {data.narrative_long}
          </div>
        )}
      </div>
    </div>
  );
}

function Gauge({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, value));
  const angle = (pct / 100) * 360;
  const style: React.CSSProperties = {
    background: `conic-gradient(var(--blue) ${angle}deg, #e5e7eb ${angle}deg)`,
  };
  return (
    <div className="gauge" style={style}>
      <div className="gaugeInner">
        <div className="gaugeValue">{pct}</div>
      </div>
    </div>
  );
}

// 샘플 평가 응답(테스트 버튼으로 삽입)
const SAMPLE_EVAL_RESPONSE: EvalData = {
  metrics: {
    intent: 5,
    specificity: 4.5,
    tradeoffs: 5,
    outcome: 4.5,
    reflection: 0,
    tech_depth: 4.5,
    jd_fit: 0,
    ownership: 0,
    coherence: 0,
    conciseness: 0.5,
  },
  summary_sentences: [
    {
      text: '질문 의도에 맞춰 커버링 인덱스의 작동 원리와 페이징 패턴에서의 이점을 정확히 설명했습니다.',
      axis: 'intent',
      intent: '핵심 개념의 정확성 확인',
      criterion: '원리와 맥락 일치',
      evidence: ['index-only', 'WHERE crea'],
    },
    {
      text: '실제 수치(794ms→211ms), 쿼리 패턴, 인덱스 구성 컬럼을 구체적으로 제시했습니다.',
      axis: 'specificity',
      intent: '구체 근거 제시',
      criterion: '수치·패턴·설계 포함',
      evidence: ['794ms→211ms', '(created_at,'],
    },
    {
      text: '쓰기 증폭과 메모리 사용 증가를 인지하고, 수용 조건과 회피·완화 전략을 균형 있게 제시했습니다.',
      axis: 'tradeoffs',
      intent: '리스크 균형 평가',
      criterion: '부작용·대안 병기',
      evidence: ['INSERT/UPD', '버퍼 풀'],
    },
    {
      text: '효과를 수치로 검증했고, 캐시 미스 모니터링 등 운영 관점의 확인 방법을 언급했습니다.',
      axis: 'outcome',
      intent: '성과와 검증 확인',
      criterion: '정량 결과·운영 지표',
      evidence: ['794ms에서', '캐시 미스'],
    },
    {
      text: '커버링 인덱스의 구성 원리와 랜덤 I/O 제거, 백테이블 루kup 제거 효과를 논리적으로 설명했습니다.',
      axis: 'tech_depth',
      intent: '원리·한계 이해 평가',
      criterion: '메커니즘·엣지 다룸',
      evidence: ['index-only', '재조회 없이'],
    },
    {
      text: '원리→부작용→감수/회피 기준→요약의 흐름으로 명확한 구조를 유지했습니다.',
      axis: 'structure',
      intent: '논리적 전개 평가',
      criterion: '서론-전개-정리',
      evidence: ['정리하면,', '한 방'],
    },
    {
      text: '자체 경험과 맥락(MySQL, 목록 API)으로 근거를 뒷받침했습니다.',
      axis: 'evidence',
      intent: '현장 근거 확인',
      criterion: '경험 인용의 질',
      evidence: ['MySQL 기반', '목록 API'],
    },
  ],
  narrative_long:
    '커버링 인덱스의 원리와 페이징 패턴에서의 효과를 “테이블로 재조회 없이 ‘index-only scan’”으로 끝낸다는 설명이 명확했습니다. 실제 사례 수치(“794ms에서 211ms”)로 임팩트를 제시해 설득력이 높습니다. 부작용으로 쓰기 증폭과 버퍼 풀 점유 증가를 짚고, 수용 조건(읽기 우위, 얕은 목록)과 회피·완화(키셋 페이징, 최소 컬럼, 후행 fetch, prefix 인덱스, 캐시 미스 모니터링)를 균형 있게 제시한 점도 좋습니다. 추가로, 수용 의사결정 시 스토리지 증가율과 쓰기 지표(페이지 분할율, redo/LSN 증가량)를 사전 측정하겠다는 기준을 밝히면 더 견고해집니다. 검증 절차는 EXPLAIN/EXPLAIN ANALYZE와 Handler_read_* 지표로 인덱스 온리 스캔 여부와 백테이블 루크업 제거를 확인하는 루틴을 명시해 보세요. 또한 업데이트가 잦은 컬럼의 포함 여부는 변경 빈도 기반으로 주기적 재평가하고, 인덱스 블로트/조각화 대응(압축, 리빌드 주기)은 “확실하지 않음”일 경우 전제 조건을 붙이면 안전합니다. 마지막으로, 키셋 페이징과 커버링 인덱스를 조합할 때 응답 필드 추가 요청 발생 시 후행 fetch로 되돌리는 롤백 전략을 준비해 운영 안정성을 높이십시오.',
  flags: {
    ValueChain_missing: false,
    Evidence_missing: false,
    Scenario_missing: false,
    Concept_error: false,
    Offtopic: false,
  },
  ccs: 4.7,
  total: 94,
};
