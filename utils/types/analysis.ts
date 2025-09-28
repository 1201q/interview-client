import { InterviewSessionStatus } from './interview';

// 1. refined text
export interface RefinedAnswer {
  refined: string[];
}

// 2. stt result
export interface SttWord {
  word: string;
  start: number;
  end: number;
}

export interface SttSegment {
  id: number;
  seek: number;
  start: number;
  end: number;
  text: string;
  tokens: number[];
  temperature: number;
  avg_logprob: number;
  compression_ratio: number;
  no_speech_prob: number;
}

export interface SttResult {
  task: string;
  language: string;
  duration: number;
  text: string;
  segments: SttSegment[];
  words: SttWord[];
  usage: {
    type: string;
    seconds: number;
  };
}

// 3. metrics result
export interface Metrics {
  intent: number;
  specificity: number;
  tradeoffs: number;
  outcome: number;
  reflection: number;
  tech_depth: number;
  jd_fit: number;
  ownership: number;
  coherence: number;
  conciseness: number;
}

export interface SummarySentence {
  text: string;
  axis: string;
  intent: string;
  criterion: string;
  evidence: string[];
}

export interface Flags {
  ValueChain_missing: boolean;
  Evidence_missing: boolean;
  Scenario_missing: boolean;
  Concept_error: boolean;
  Offtopic: boolean;
}

export interface EvaluationResult {
  metrics: Metrics;
  summary_sentences: SummarySentence[];
  narrative_long: string;
  flags: Flags;
  ccs: number;
  total: number;
}

// 4. voice
export interface Interval {
  s: number;
  e: number;
}

export interface VoiceDiag {
  drops: {
    context: number;
    energy_valley: number;
    low_prob: number;
    too_short_long: number;
    vad: number;
  };
  gain_db: number;
  post_nms_kept: number;
  pre_nms_candidates: number;
  segmentation_mode: string;
  total_windows: number;
}

export interface VoiceFluency {
  fillers_per_min: number;
}

export interface VoicePauseHygiene {
  avg_phrase_sec: number;
  long_pauses_count: number;
  long_pauses_per_min: number;
  longest_pause_ms: number;
  pause_distribution: {
    head: number;
    body: number;
    tail: number;
  };
  phrase_len_sd: number;
}

export interface VoiceRatios {
  filler_ratio: number;
  silence_per_duration: number;
  silence_per_speech: number;
  silence_plus_filler_per_speech_wo_filler: number;
  speech_density: number;
}

export interface VoiceMetrics {
  diag: VoiceDiag;
  duration_ms: number;
  filler_ms: number;
  fluency: VoiceFluency;
  intervals: {
    filler: Interval[];
    silence: Interval[];
    speech: Interval[];
    speech_wo_filler: Interval[];
  };
  pause_hygiene: VoicePauseHygiene;
  ratios: VoiceRatios;
  silence_ms: number;
  speech_ms: number;
  speech_wo_filler_ms: number;
}

// 최종
export type AnalysisData = {
  id: string;
  status: InterviewSessionStatus;
  order: number;
  text: string;
  result: {
    feedback: EvaluationResult;
    refined: RefinedAnswer;
    stt: SttResult;
    voice: VoiceMetrics;
  };
};
