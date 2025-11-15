'use client';
import styles from './styles/hero.module.css';
import Link from 'next/link';

import Blossom from '@/public/OpenAI-black-monoblossom.svg';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

type Role =
  | '프론트엔드 개발자'
  | '백엔드 개발자'
  | '모바일 앱 개발자'
  | 'UI / UX 디자이너'
  | '데이터 분석가'
  | '마케팅 매니저'
  | '프로덕트 매니저'
  | '서비스 기획자'
  | '콘텐츠 마케터'
  | '재무 / 회계 담당자'
  | '품질관리 담당자'
  | '영업 매니저'
  | '영상 콘텐츠 프로듀서'
  | '인사 담당자'
  | 'CS 매니저'
  | '브랜드 매니저';

type BasedOn = '이력서' | '채용공고' | '둘다';

type QuestionTemplate = {
  text: string;
  based_on: BasedOn;
  why: string;
};

type Card = QuestionTemplate & {
  role: Role;
  id: string;
};

const sampleQuestions: Record<Role, QuestionTemplate[]> = {
  '프론트엔드 개발자': [
    {
      text: '이력서에서 React 프로젝트 성능을 개선했다고 하셨는데, 어떤 지표를 어떻게 올리셨나요?',
      based_on: '이력서',
      why: '이력서에 적힌 성능 개선 경험이 실제로 어떤 문제를 어떤 지표로 해결했는지 구체적으로 검증하기 위해서예요.',
    },
    {
      text: '채용공고에서 디자인 시스템 경험을 요구하는데, 공통 컴포넌트는 어떤 기준으로 설계하시나요?',
      based_on: '채용공고',
      why: '공고에서 요구하는 디자인 시스템 경험이 단순 사용 경험이 아닌, 설계 기준과 원칙을 이해하고 있는지 확인하기 위해서예요.',
    },
    {
      text: 'CSR, SSR, SSG 중 어떤 방식을 선호하시고, 그 이유는 무엇인가요?',
      based_on: '둘다',
      why: '지원자의 프론트엔드 아키텍처 이해도와, 공고에서 요구하는 서비스 특성에 맞는 선택과 트레이드오프 판단 능력을 평가하기 위해서예요.',
    },
  ],
  '백엔드 개발자': [
    {
      text: '이력서에 대규모 트래픽 API 서버 운영 경험이 있는데, 당시 병목 구간을 어떻게 찾고 해결하셨나요?',
      based_on: '이력서',
      why: '이력서에 적힌 대규모 트래픽 경험이 실제로 어떤 분석과 튜닝 과정을 거쳤는지 깊이를 확인하기 위해서예요.',
    },
    {
      text: '채용공고에서 마이크로서비스를 강조하는데, 분산된 서비스 간 트랜잭션은 어떻게 관리하시겠어요?',
      based_on: '채용공고',
      why: '공고에서 요구하는 마이크로서비스 환경에서의 트랜잭션과 일관성 설계 역량을 검증하기 위해서예요.',
    },
    {
      text: '동시성 이슈를 막기 위해 트랜잭션 격리 수준과 락은 어떻게 설계하시나요?',
      based_on: '둘다',
      why: '지원자의 백엔드 기본기와 공고에서 요구하는 안정적인 데이터 처리 능력을 함께 확인하기 위해서예요.',
    },
  ],
  '모바일 앱 개발자': [
    {
      text: '이력서에서 앱 크래시율 감소를 달성하셨는데, 어떤 도구로 원인을 분석하고 어떻게 개선하셨나요?',
      based_on: '이력서',
      why: '이력서에 적힌 크래시율 개선 경험이 단순 결과인지, 실제로 어떤 분석과 실행 과정을 거쳤는지 파악하기 위해서예요.',
    },
    {
      text: '채용공고에서 푸시 알림 경험을 요구하는데, 휴면 사용자 재활성화를 위해 어떤 시나리오를 설계하시겠어요?',
      based_on: '채용공고',
      why: '공고에서 요구하는 푸시와 리텐션 관련 역량을 실제 캠페인 설계 관점에서 검증하기 위해서예요.',
    },
    {
      text: 'iOS와 Android 공통 코드를 어떻게 관리하고, 플랫폼별 차이는 어떻게 분리하시나요?',
      based_on: '둘다',
      why: '지원자의 크로스플랫폼 구조 설계 능력과 공고에서 기대하는 코드 품질·유지보수성을 함께 확인하기 위해서예요.',
    },
  ],
  'UI / UX 디자이너': [
    {
      text: '포트폴리오의 온보딩 개선 사례에서, 문제를 어떻게 정의하고 어떤 지표로 검증하셨나요?',
      based_on: '이력서',
      why: '포트폴리오에 적힌 개선 사례가 단순한 화면 변경이 아니라, 문제 정의와 지표 기반 검증까지 이루어졌는지 확인하기 위해서예요.',
    },
    {
      text: '개발자가 구현 난이도를 이유로 디자인 수정을 요청하면, 어떻게 조율하시나요?',
      based_on: '둘다',
      why: '실제 협업 상황에서 비즈니스·UX·기술 제약을 어떻게 균형 있게 조율하는지 커뮤니케이션 역량을 평가하기 위해서예요.',
    },
    {
      text: '신규 기능 설계 시 본인이 가장 중요하게 보는 UX 원칙 한 가지와 그 이유를 설명해 주세요.',
      based_on: '둘다',
      why: '지원자의 UX 철학과 공고에서 기대하는 제품 방향성이 맞는지, 사고의 기준점을 파악하기 위해서예요.',
    },
  ],
  '데이터 분석가': [
    {
      text: '이력서에서 이탈 분석 프로젝트를 언급하셨는데, 이탈을 어떻게 정의하고 어떤 세그먼트에서 인사이트를 찾으셨나요?',
      based_on: '이력서',
      why: '이력서에 적힌 분석 경험이 단순 리포트가 아니라, 비즈니스에 의미 있는 정의와 세그먼트 인사이트까지 포함하는지 확인하기 위해서예요.',
    },
    {
      text: '채용공고에서 핵심 지표 관리가 중요하다고 하는데, 우리 서비스의 North Star Metric은 무엇이 적절하다고 보시나요?',
      based_on: '채용공고',
      why: '공고에서 강조하는 핵심 지표 관리를 실제 서비스 특성에 맞춘 NSM 설정 관점으로 이해하고 있는지 평가하기 위해서예요.',
    },
    {
      text: 'A/B 테스트 결과가 유의미한지 판단하기 위해 어떤 절차와 기준을 사용하시나요?',
      based_on: '둘다',
      why: '지원자의 통계적 사고와 실험 설계 능력이 공고에서 요구하는 데이터 기반 의사결정 역량과 맞는지 확인하기 위해서예요.',
    },
  ],
  '마케팅 매니저': [
    {
      text: '이력서에 회원 가입률 성장 캠페인 경험이 있는데, 가장 효과적이었던 채널과 그 이유는 무엇이었나요?',
      based_on: '이력서',
      why: '이력서에 적힌 성과가 우연인지, 명확한 가설·채널 전략·학습 포인트가 있었는지 검증하기 위해서예요.',
    },
    {
      text: '유입은 잘 되지만 첫 주 이탈률이 높다면, 온보딩 1주일 동안 어떤 캠페인을 설계하시겠어요?',
      based_on: '둘다',
      why: '지원자의 퍼널 관점 이해와, 공고에서 요구하는 리텐션·온보딩 개선 역량을 함께 평가하기 위해서예요.',
    },
    {
      text: '여러 채널을 동시에 집행할 때, 어떤 기준으로 예산을 재분배하시나요?',
      based_on: '둘다',
      why: '성과 데이터를 바탕으로 채널 믹스를 최적화하는 사고 방식이 공고에서 기대하는 퍼포먼스 마케팅 역량과 맞는지 확인하기 위해서예요.',
    },
  ],
  '프로덕트 매니저': [
    {
      text: '이력서에서 제품 출시나 기능 런칭을 리드했다고 하셨는데, 당시 어떤 목표 지표를 두고 어떤 과정을 통해 달성하셨나요?',
      based_on: '이력서',
      why: '이력서에 적힌 런칭 경험이 단순 참여가 아니라, 문제 정의와 목표 설정, 실행과 회고까지 스스로 주도했는지를 확인하기 위해서예요.',
    },
    {
      text: '채용공고에서 데이터 기반 의사결정을 강조하는데, 특정 기능 도입 여부를 결정하기 위해 어떤 데이터를 어떻게 수집·해석하실 건가요?',
      based_on: '채용공고',
      why: '공고에서 요구하는 데이터 기반 PM 역량이 단순 지표 열람이 아니라, 실험 설계와 해석을 통한 의사결정으로 이어질 수 있는지 알아보기 위해서예요.',
    },
    {
      text: '여러 이해관계자가 서로 다른 우선순위를 요구할 때, 제품 로드맵의 우선순위를 어떻게 정리하고 설득하시겠어요?',
      based_on: '둘다',
      why: '지원자가 제품 지향점과 이해관계자 요구를 균형 있게 조율하며, 구조적으로 우선순위를 세울 수 있는지 평가하기 위해서예요.',
    },
  ],

  '서비스 기획자': [
    {
      text: '이력서에서 서비스 개편이나 신규 서비스 기획을 담당했다고 하셨는데, 당시 타깃 사용자의 어떤 문제를 어떻게 정의하셨나요?',
      based_on: '이력서',
      why: '이력서에 적힌 서비스 개선 경험이 단순 기능 추가가 아니라, 사용자 문제 정의와 가설 설정을 기반으로 진행됐는지 확인하기 위해서예요.',
    },
    {
      text: '채용공고에서 사용자 경험과 플로우 설계를 강조하는데, 회원 가입부터 첫 핵심 기능 사용까지의 여정을 어떻게 설계하시겠어요?',
      based_on: '채용공고',
      why: '공고에서 요구하는 서비스 플로우 설계 능력이 화면 나열 수준을 넘어, 전환 지점과 이탈 지점을 고려한 구조적 설계로 이어지는지 평가하기 위해서예요.',
    },
    {
      text: '개발·디자인·운영 등 여러 팀이 동시에 관여하는 기능을 기획할 때, 제약사항이 많아지면 어떤 기준으로 요구사항을 조정하시나요?',
      based_on: '둘다',
      why: '지원자가 현실적인 제약 속에서 핵심 가치를 지키면서도 협업 가능한 수준으로 요구사항을 정리할 수 있는지 확인하기 위해서예요.',
    },
  ],

  '콘텐츠 마케터': [
    {
      text: '이력서에서 성과가 좋았던 캠페인을 언급하셨는데, 어떤 콘텐츠와 메시지가 주요 성과를 만들었다고 보시나요?',
      based_on: '이력서',
      why: '이력서에 적힌 성과가 우연이 아니라, 명확한 타깃 정의와 콘텐츠 콘셉트 설계에 기반한 결과였는지 확인하기 위해서예요.',
    },
    {
      text: '채용공고에서 여러 채널(블로그, 뉴스레터, SNS 등) 운영을 강조하는데, 채널별로 어떤 역할과 전략 차이를 두고 기획하시겠어요?',
      based_on: '채용공고',
      why: '공고에서 요구하는 멀티 채널 운영 능력이 단순 동시 발행이 아니라, 채널 특성과 페르소나에 맞춘 전략적 운영인지 평가하기 위해서예요.',
    },
    {
      text: '브랜드 인지도와 전환 둘 다 중요할 때, 콘텐츠 캘린더와 실험 설계를 어떻게 구성하시겠어요?',
      based_on: '둘다',
      why: '지원자가 상단 퍼널과 하단 퍼널을 동시에 고려하면서도, 실험 가능한 단위로 콘텐츠를 설계할 수 있는지 확인하기 위해서예요.',
    },
  ],
  '재무 / 회계 담당자': [
    {
      text: '이력서에서 재무제표 마감이나 결산 업무를 담당했다고 하셨는데, 마감 프로세스에서 본인이 가장 중요하게 관리한 포인트는 무엇이었나요?',
      based_on: '이력서',
      why: '이력서에 적힌 결산 경험이 단순 반복 업무가 아니라, 정확성과 기한 준수를 위한 프로세스 관리 관점에서 수행됐는지 확인하기 위해서예요.',
    },
    {
      text: '채용공고에서 내부통제와 컴플라이언스를 강조하는데, 회계 처리 방식에 대해 의견이 갈렸던 경험이 있다면 어떻게 해결하셨나요?',
      based_on: '채용공고',
      why: '공고에서 요구하는 내부통제 역량이 기준을 단순 암기하는 수준이 아니라, 실제 상황에서 설득과 조율로 이어질 수 있는지 평가하기 위해서예요.',
    },
    {
      text: '비용 절감이나 수익성 개선을 위해 데이터를 분석해 제안했던 사례가 있다면, 어떤 관점에서 데이터를 보고 어떤 결론을 도출하셨나요?',
      based_on: '둘다',
      why: '지원자가 재무 데이터를 단순 보고용이 아니라, 경영 의사결정에 활용 가능한 인사이트로 전환할 수 있는지 확인하기 위해서예요.',
    },
  ],

  '품질관리 담당자': [
    {
      text: '이력서에서 품질 지표를 개선했다고 하셨는데, 당시 어떤 지표를 어떤 방식으로 관리하고 개선하셨나요?',
      based_on: '이력서',
      why: '이력서에 적힌 품질 개선 경험이 단순 수치 보고가 아니라, 원인 분석과 개선 활동까지 포함된 경험인지 확인하기 위해서예요.',
    },
    {
      text: '채용공고에서 품질 시스템이나 인증(예: ISO)을 언급하는데, 이러한 기준을 현장에 적용할 때 가장 어려웠던 점은 무엇이었나요?',
      based_on: '채용공고',
      why: '공고에서 요구하는 품질 시스템 이해도가 문서 수준에 머무르지 않고, 실제 현장 적용과 변화 관리로 이어질 수 있는지 평가하기 위해서예요.',
    },
    {
      text: '생산성과 품질이 충돌하는 상황에서, 어떤 기준으로 의사결정을 내리고 관련 부서와 어떻게 조율하시겠어요?',
      based_on: '둘다',
      why: '지원자가 품질 기준을 지키면서도 생산 현장의 현실을 이해하고, 설득과 협업을 통해 균형점을 찾을 수 있는지 확인하기 위해서예요.',
    },
  ],

  '영업 매니저': [
    {
      text: '이력서에서 매출 목표를 달성하거나 초과했다고 하셨는데, 당시 어떤 전략과 활동이 성과에 가장 크게 기여했다고 보시나요?',
      based_on: '이력서',
      why: '이력서에 적힌 실적이 단순 운이 아니라, 시장 분석과 고객 관리 전략에 기반한 결과였는지 확인하기 위해서예요.',
    },
    {
      text: '채용공고에서 B2B 영업과 장기 파트너십을 강조하는데, 신규 고객 발굴과 기존 고객 유지 사이에서 우선순위를 어떻게 두고 활동하시겠어요?',
      based_on: '채용공고',
      why: '공고에서 요구하는 영업 역량이 단기 매출에만 치우치지 않고, 관계 구축과 장기 가치까지 고려하는지 평가하기 위해서예요.',
    },
    {
      text: '가격 인상이나 조건 변경처럼 고객에게 불리하게 느껴질 수 있는 제안을 해야 할 때, 어떤 방식으로 커뮤니케이션하고 협상하시겠어요?',
      based_on: '둘다',
      why: '지원자가 회사 이익과 고객 신뢰를 모두 고려하면서, 논리적이고 공정한 협상을 진행할 수 있는지 확인하기 위해서예요.',
    },
  ],

  '영상 콘텐츠 프로듀서': [
    {
      text: '이력서에서 담당했던 영상 콘텐츠 중 가장 임팩트가 컸던 프로젝트를 하나 꼽는다면, 기획 의도와 실제 성과는 어땠나요?',
      based_on: '이력서',
      why: '이력서에 적힌 영상 제작 경험이 단순 제작 참여가 아니라, 기획 의도와 성과를 연결해 볼 수 있는 수준인지 확인하기 위해서예요.',
    },
    {
      text: '채용공고에서 브랜드 캠페인이나 광고 영상을 언급하는데, 브랜드 메시지를 영상으로 풀어낼 때 어떤 요소를 가장 중요하게 보시나요?',
      based_on: '채용공고',
      why: '공고에서 요구하는 브랜드 이해와 크리에이티브 역량이, 단순한 멋있는 화면 구성보다 메시지 전달과 일관성에 기반하는지 평가하기 위해서예요.',
    },
    {
      text: '짧은 제작 기간과 제한된 예산 속에서 프로젝트를 진행해야 했던 경험이 있다면, 어디에 우선순위를 두고 퀄리티를 확보하셨나요?',
      based_on: '둘다',
      why: '지원자가 일정·예산 제약 속에서도 핵심 메시지와 필요한 퀄리티를 유지하기 위해 무엇을 포기하고 무엇을 지켰는지 판단할 수 있는지 확인하기 위해서예요.',
    },
  ],

  '인사 담당자': [
    {
      text: '이력서에서 채용이나 평가, 보상 관련 제도 개선에 참여했다고 하셨는데, 어떤 문제를 어떻게 파악하고 개선안을 만들었는지 설명해 주세요.',
      based_on: '이력서',
      why: '이력서에 적힌 HR 프로젝트 경험이 단순 운영이 아니라, 구성원과 조직의 문제를 구조적으로 바라보고 해결하려는 시도였는지 확인하기 위해서예요.',
    },
    {
      text: '채용공고에서 채용 브랜딩이나 조직 문화 개선을 언급하는데, 우리 회사의 특성을 반영한 채용 메시지는 어떻게 설계하시겠어요?',
      based_on: '채용공고',
      why: '공고에서 요구하는 인사담당자의 역할이 단순 공고 게시가 아니라, 회사의 강점을 언어화하고 후보자 경험을 설계하는 역할인지 평가하기 위해서예요.',
    },
    {
      text: '성과가 좋은 구성원과 어려움을 겪는 구성원이 섞여 있는 팀에서, HR이 어떤 방식으로 리더와 협력해 팀을 지원해야 한다고 보시나요?',
      based_on: '둘다',
      why: '지원자가 단순 규정 집행자가 아니라, 조직과 구성원의 성장을 돕는 파트너로서 어떤 관점을 가지고 있는지 확인하기 위해서예요.',
    },
  ],

  'CS 매니저': [
    {
      text: '이력서에서 고객센터나 CS 조직을 운영했다고 하셨는데, 응답 속도와 해결률을 높이기 위해 어떤 지표를 관리하고 개선하셨나요?',
      based_on: '이력서',
      why: '이력서에 적힌 CS 운영 경험이 단순 문의 처리 양 관리가 아니라, 서비스 품질을 높이기 위한 지표 기반 운영이었는지 확인하기 위해서예요.',
    },
    {
      text: '채용공고에서 VOC 분석과 프로세스 개선을 강조하는데, 반복되는 불만 유형이 발견됐을 때 어떤 식으로 원인 분석과 개선 제안을 하시겠어요?',
      based_on: '채용공고',
      why: '공고에서 요구하는 CS 매니저의 역할이 단순 응대 관리가 아니라, 제품과 서비스 개선으로 이어지는 연결고리를 만들 수 있는지 평가하기 위해서예요.',
    },
    {
      text: '감정적으로 격해진 고객 응대 상황에서, 상담사를 보호하면서도 회사와 고객 모두에게 합리적인 해결책을 찾기 위해 어떤 기준으로 판단하시겠어요?',
      based_on: '둘다',
      why: '지원자가 고객 만족과 상담사 케어를 동시에 고려하면서, 일관된 원칙과 기준을 가지고 의사결정을 내릴 수 있는지 확인하기 위해서예요.',
    },
  ],

  '브랜드 매니저': [
    {
      text: '이력서에서 브랜드 캠페인이나 리브랜딩 프로젝트를 담당했다고 하셨는데, 기존 인식과 목표하는 브랜드 이미지는 어떻게 달랐나요?',
      based_on: '이력서',
      why: '이력서에 적힌 브랜드 관련 경험이 단순 디자인 변경이 아니라, 인식과 포지셔닝 관점에서 접근된 프로젝트였는지 확인하기 위해서예요.',
    },
    {
      text: '채용공고에서 브랜드 일관성과 톤앤매너를 강조하는데, 여러 채널과 팀이 동시에 브랜드를 사용하는 상황에서 이를 어떻게 관리하시겠어요?',
      based_on: '채용공고',
      why: '공고에서 요구하는 브랜드 매니저의 역할이 가이드를 만드는 데 그치지 않고, 조직 전체에 일관되게 적용되도록 설계·조율할 수 있는지 평가하기 위해서예요.',
    },
    {
      text: '브랜드 인지도나 선호도 같은 지표를 설정하고 관리해 본 경험이 있다면, 어떤 지표를 선택하고 어떻게 추적하셨나요?',
      based_on: '둘다',
      why: '지원자가 브랜드 활동을 정성적인 이미지 향상뿐 아니라, 측정 가능한 지표로 관리할 수 있는지 확인하기 위해서예요.',
    },
  ],
};

// ===========================  상수
const ITEM_HEIGHT = 178; // 카드 1장 높이
const GAP = 6; // 카드 사이 간격
const STEP = ITEM_HEIGHT + GAP;

const VIEWPORT_HEIGHT = ITEM_HEIGHT * 2.05 + GAP * 2;

const makeFlatCards = (): Card[] => {
  const entries = Object.entries(sampleQuestions) as [
    Role,
    QuestionTemplate[],
  ][];

  return entries.flatMap(([role, list]) =>
    list.map((q, index) => ({
      ...q,
      role,
      id: `${role}-${index}`,
    })),
  );
};

const HeroSection = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const [allCards, setAllCards] = useState<Card[]>(() => makeFlatCards());
  const [centerIndex, setCenterIndex] = useState(1); // 처음에는 1번 카드가 중앙
  const [displayRole, setDisplayRole] = useState<Role>(
    allCards[1]?.role ?? '프론트엔드 개발자',
  );
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const n = allCards.length;

  // ===== 트랙 y 계산  항상 centerIndex 카드가 중앙에 오도록 =====
  const centerTop = VIEWPORT_HEIGHT / 2 - ITEM_HEIGHT / 2; // 화면에서 중앙 카드의 top 위치
  const trackY = centerTop - centerIndex * STEP;

  // 클라 마운트 후 한 번 셔플
  useEffect(() => {
    setAllCards((prev) => {
      const arr = [...prev];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    });
  }, []);

  // 셔플 이후 중앙/텍스트 초기화
  useEffect(() => {
    if (!n) return;
    const initialCenter = n > 1 ? 1 : 0;
    setCenterIndex(initialCenter);
    setDisplayRole(allCards[initialCenter].role);
    setCurrentText('');
    setIsDeleting(false);
  }, [n]);

  // 타이핑 / 삭제 + centerIndex 이동
  useEffect(() => {
    if (!n) return;

    let timer: NodeJS.Timeout;
    const target = displayRole;

    if (isDeleting) {
      if (currentText.length > 0) {
        timer = setTimeout(() => {
          setCurrentText((prev) => prev.slice(0, -1));
        }, 100);
      } else {
        // 글자 다 지워진 순간 => 다음 카드 중앙으로
        setIsDeleting(false);
        setCenterIndex((prev) => {
          const next = (prev + 1) % n;
          setDisplayRole(allCards[next].role);
          return next;
        });
      }
    } else {
      if (currentText.length < target.length) {
        timer = setTimeout(() => {
          setCurrentText((prev) => target.slice(0, prev.length + 1));
        }, 150);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2000); // 2초 보여준 뒤 삭제 시작
      }
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, displayRole, allCards, n]);

  return (
    <section className={styles.heroSection}>
      <div className={styles.container}>
        <LeftSection isLoggedIn={isLoggedIn} />

        <div className={styles.rightWrapper}>
          <p className={styles.smallText}>어떤 직군이든</p>
          <span className={styles.jobRole}>
            {currentText}
            <span className={styles.cursor}></span>
          </span>

          {/* 카드 스택 */}
          <div className={styles.cardViewPort}>
            <motion.div
              className={styles.cardTrack}
              animate={{ y: trackY }}
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            >
              {allCards.map((card, index) => {
                const isCenter = index === centerIndex;
                const isTop = index === (centerIndex - 1 + n) % n;
                const isBottom = index === (centerIndex + 1) % n;

                return (
                  <motion.div
                    initial={false}
                    className={styles.item}
                    key={card.id}
                    style={{
                      height: ITEM_HEIGHT,
                      marginBottom: GAP,
                    }}
                    animate={{
                      scale: isCenter ? 1 : 0.9,
                      opacity: isCenter ? 1 : 0.25,
                      y: isTop ? -6 : isBottom ? 6 : 0,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 260,
                      damping: 24,
                    }}
                  >
                    <div className={styles.itemHeader}>
                      {card.based_on === '둘다' && (
                        <span className={styles.itemBadge}>
                          이력서 · 공고 기반
                        </span>
                      )}
                      {card.based_on === '이력서' && (
                        <span className={styles.itemBadge}>이력서 기반</span>
                      )}
                      {card.based_on === '채용공고' && (
                        <span className={styles.itemBadge}>채용 공고 기반</span>
                      )}
                    </div>
                    <p className={styles.questionText}>Q. {card.text}</p>
                    <p className={styles.whyText}>{card.why}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

const LeftSection = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  return (
    <div className={styles.leftWrapper}>
      <div className={styles.poweredBy}>
        <span>
          Powered by <strong>ChatGPT</strong>
        </span>
        <div className={styles.icon}>
          <Blossom />
        </div>
      </div>
      <h2>AI 면접관과 함께하는</h2>
      <h1>
        실전형 <span className={styles.brushWrapper}>AI 모의 면접</span> 준비
      </h1>
      <p>당신의 커리어에 맞는 질문으로, 진짜 면접처럼 준비하세요.</p>
      <div className={styles.buttonWrapper}>
        {isLoggedIn ? (
          <Link
            href="/new-request"
            className={`${styles.button} ${styles['button-ghost']}`}
          >
            서비스로 이동하기
          </Link>
        ) : (
          <Link
            href="/login"
            className={`${styles.button} ${styles['button-ghost']}`}
          >
            무료로 이용하기
          </Link>
        )}
      </div>
    </div>
  );
};

export default HeroSection;
