import { useRef, useState } from 'react';

import styles from './styles/uploader.module.css';

import { motion } from 'motion/react';
import Button from '@/components/shared/Button';
import { useAtom } from 'jotai';
import { currentRequestStageAtom, resumeTextAtom } from '@/store/request-stage';
import { generateQuestion } from '@/utils/services/generateQuestion';
import { useRouter } from 'next/navigation';

const TEST_RESUME = `Server Platform Engineer. 높은 퍼포먼스의유연한 소프트웨어를 개발하는 엔지니어입니다 압도적인 결과 산출을 위해 끊임없이고민하고 개선하는 자세가 제가 갖추어 나가야할 스탠스라고 생각합 조직의 성장을 위해 항상 지식을 공유하는 시간을 가집니다. 높은 퍼포먼스를 위한 조직내의 역량을 강 화하기 위하여 극도의 투명함과 신뢰의 문화를 추구하고 협업하며 교육청과 공동사업을 진행하며 +3,000명의 유저를 보유한 서비스를 개발/운영, 200명의 DAU를 보유한 서비스를 운영중입니다. About 0000. 00. 00 email@gmail.com Skills Java, Kotlin, Spring Frameworks MySQL, Redis, MongoDBhttps://twitter.com/hellowantedhttps://github.com/hellowanted AWS, Kubernetes, Prometheus, Grafana, Loki, Kafka, Terraform 외 여러 오픈소스 NNN 서비스 2021. 03 ~ present GitHub Site Docs 개요 역할 V2 - 서버 엔지니어로서 RestfulAPI 개발, 성능 개선, 모니터링 환경 구축, CI/CD V3 - 마이크로서비스아키텍처 전환(설계, 구축, 개발), 마이크로서비스 통합 환경모니 터링, RESTful / gRPC API 개발, 배치 애플리케이션 개발 Skills Java, Kotlin, Spring Boot, Spring Batch, Spring Webflux, Spring Cloud AWS, Kubernetes, Kafka, Prometheus, Grafana, Loki, Helm Charts, ArgoCD MySQL, Redis 애플리케이션개발(V2,V3) 서비스 애플리케이션API 개발 Gateway 미들웨어개발 GitHub Docs 분산 트랜잭션 관리, 이벤트 소싱 슬로우 쿼리 개선, Indexing Docs 예약 시스템 동시성문제 해결 Docs AS-IS 심야 자습, 안마의자 예약 시스템에서 최대 인원의 수를 초과하게 되는 동시성 문제들이 발 생했습니다. TO-BE 이후 락을 반납하도록 구현했습니다. 효율적인 Redis 활용을 위한 메모리 관리 사전에 Redis 환경을 더욱 최적화하여 처리량을 개선하기 위해 여러가지 옵션들을 설정했 습니다. Redis의 max-memory를 설정하여 운영체제의 가상 메모리인 swap 영역까지 사용하는 것을 방지했으며, cache eviction 정책을 고려하여 적용된 애플리케이션 특성 에 맞는 LFU 알고리즘을적용하여 캐시 메모리 성능을 개선했습니다. 마이크로서비스전환(V3) EKS 환경 구축 GitHub Docs Node 가용성 문제 개선 모니터링 모니터링 스택으로 다양한 메트릭, 대시보드 커스텀의 이점등을 고려하여 오픈소스 모니터 링툴 Grafana를 채택, Loki와 Prometheus 그리고 Spring Actuator, Promtail과 함 께 적용하여 모니터링합니다. 회고 마이크로서비스로 전환하면서 신경써야할 점이 매우 많다는 것을 느꼈습니다. 여러 오픈소 스들을 적용하면서 가파른 러닝커브와 팀원들과 협업하면서 관리 방법을 인수인계 하는 과 정에서 커뮤니케이션과 문서화가 매우 중요하다고 느끼게 되었습니다. 극도의 투명함의 문 화를 추구하게 된 계기이자 여러 새로운 기술들을 도입해 볼 수 있어 매우 즐거웠고, 좋은 경험이었습니다. 또한 실시간으로 프로젝트를운영하기에 여러 문의 사항들과 이슈 제보가 끊임없이 나타났기 때문에 유연한 소프트웨어개발을 추구하게 된 계기가 있었고 다양한 문제 상황들을 겪고 해결할 수 있었던프로젝트였습니다. NNN NNNN NNNN 2023. 09 ~ 2024. 03 개요 입니다. NN개교의 특성화 고등학교와 N개교의 대학, NN명의 대학교수, 멘토, 광주 지역 기업체 강사들이 해당 서비스를 사용하며 총 유저 NNNN+명을 보유한서비스입니다. 역할 서버 엔지니어로서 애플리케이션 I/O 레이턴시 최적화, 쿼리 최적화, 배치 애플리케이 션 개발, RESTful API 개발, 멀티모듈 아키텍처 설계, 구성 인프라 엔지니어로서 AWS 아키텍처 설계, GitHub Actions CI/CD 구축, Terraform을 통한 인프라 스펙 선언, ELK 기반 모니터링, 비용 절감을 위한 인스턴스 매니저 개발 Skills Kotlin, Spring Boot, Spring Batch, Shell Script AWS, Docker, Terraform, GitHub Actions, Datadog MySQL, Redis, Tibero Persistable, 쿼리성능최적화 문제 해결 인프라엔지니어로서기여 서버 인프라 구성 AWS 인스턴스 매니저 개발 GitHub 프로젝트아키텍처설계 모듈화/ERD 회고 0부터 시작하면서 NNN측도 처음 소프트웨어 관련 프로젝트를 함께 하는지라 부족한 문 서화와 전체 팀원들의 요구사항 파악이 부족했던 점, 커뮤니케이션의 어려움등으로 많은 경험을 한 프로젝트 였습니다. 그러나 저희 개발팀 내에서는 데일리 스크럼, 애자일, MVP, 스프린트 등의 방식의 프로젝트 협업을 통해 부족한 시간 대비 꽤나 거대한 프로젝트였음 에도 성공적으로 배포를 완료했고 NNNN만원 지원을 받았던 대규모 프로젝트였습니다. 모르는 사람, 다른 직군의 사람들과 협업을 하면서 여러 시야에서 프로덕트를 바라볼 수 있 게 되었습니다. GAuth 2022.07 ~ present 개요 역할 OAuth 인증/인가플로우 설계, 개발 애플리케이션 API, Open API 관련 API 설계/개발, 성능 개선 JVM 환경에서 간단하게 GAuth를 사용할 수 있게 도와주는 SDK 개발 Skills Kotlin, Spring Boot AWS, Docker, Terraform, GitHub Actions MySQL, Redis OAuth 플로우설계/개발 OAuth 서비스를 사용하여 다른교내 프로젝트내에서 GAuth 계정을 이용하기 위해 제공 되어야할 인증/인가 플로우를 구상하고그에 맞추어 Open API, SDK를 개발했습니다. GAuth SDK 개발 했습니다. 회고 프로젝트 도메인을 분석하면서 OAuth라는 도메인을 분석하기 위해 색다른 방식의 생각과 고민들을 했습니다. 도메인 특성상 보안적인 요소가 매우중요했으며 유연하게 학생 정보 를 동기화하기 위해 어떤 솔루션을 만들 수 있을까 하며 여러가지 방법을 시도해보고 팀원 들과 회의해봤던 시간이였고, 실시간으로 고객의 불편함과 이슈에 대응하여 빠르게 개선하 고 변화하는소프트웨어를 개발해볼 수있었던 좋은 경험이였습니다. Other Projects Hi - HomeBase Interface 2022. 08 ~ present | Server Developer G고등학교교내 학습 공간 홈베이스예약, 관리 서비스 Contribute: 서버 API 개발, 동시성 핸들링, 헥사고날 아키텍처 설계, N + 1 해결 현재까지 지속적으로 서비스 운영/개선중 DAU 80 http api test 작성, Docker, AWS EC2 모놀리식 서비스 배포, 운영 Go API - GSM Open API 2022. 11 ~ 2023. 03 | Server Developer G고등학교교내 정보 Open API 서비스 Contribute: api key 발급, 인증/인가 기능 개발, 교내 정보 Open API 개발 AWS EC2 배포, Code Deploy + GitHub Action CI/CD 구축 Others estudy 2022. 06 ~ present 지식을 습득하고, 메타인지 활성화를 위하여 꾸준히 기록장을 작성중입니다. 서버, 백엔드그리고 더 넓게 나아가 소프트웨어 학문 그 자체를 학습하고 기록합니다. GitHub Star +200 rks-java 2024. 04 ~ present Open Sources. 오픈소스 프로젝트 개선을 위해 기여한 경험이 있습니다. 2023.09.19-spring-kafka: sample 결과 출력 문서 개선 2023.09.21-spring-framework: webflux 확장함수 null값 처리 개선 2023.09.23-spring-boot: Actuator HealthMetric 조건 검사 개선 2023.09.23-armeria: Type 클래스 확장 함수명 네이밍 개선 2024.01.06-Exposed: SQL, update Statement 개선 2024.01.19-http-auth-parser: 문서 예제 오류 fix 2024.01.30-kotlin-jdsl: 산술 연산자 CEILING 스펙 정의, 테스트 코드 작성 2024.03.08-cglib: Spring DI, Enhancer private method 관련 이슈 트래킹 Certificated 정보처리기능사- NNNN 정기기능사 제 N회 SQL 개발자 - NNNN 제 N회 Awards (2222) NNN 역량 인증대회 우수상 - G학교 (2223) 제 NN회 NN 해커톤 우수상 Presentation Youtube 컨퍼런스 스피커로 세 번 발표해본 경험이 있습니다. KotlinConf’2024 in South Korea 에서 NNNNNN 주제로 발표했으며, NNN Concerence 1, 2회 컨퍼런스에서도 기술, 성장에 관련한 주제로 발표를 진행했습니다. 2023 제 1회 NNN 컨퍼런스 스피커 활동 (Spring Boot 근데 코틀린을 곁들인) 2023 NNN Conference 스피커 활동 (개발자로서 미친 성장을 이루어내는방법) KotlinConf’24 Global in South Korea 스피커 활동 (NNNNNNNNNNNN)`;
const TEST_JOB =
  '토스플레이스 소속  정규직  초기 멤버  합류하게 될 팀에 대해 알려드려요    토스플레이스 Server Developer (Product)포지션은 초기 멤버로 팀에 합류하여 다양한 경험을 해보실 수 있어요.  토스에서 새롭게 진출하는 오프라인 결제산업의 역사를 만들어가고 있어요. 설레는 마음으로 결제 생태계의 변화를 기획하고 있습니다.  최고의 결제 단말기를 성공적으로 출시할 수 있도록 Business Development Manager, Purchasing Manager, Hardware Engineer 등 여러 동료들과 함께 일해요.  합류하면 함께할 업무예요    오프라인 결제 시장에 디지털 혁신을 만들고, 이를 통해 아름다운 결제 경험을 제공하는 Product 서버를 설계하고 개발해요.  최고의 가치를 제공하기 위해 시스템 서비스 설계부터 운영까지 보이지 않는 모든 일을 하고 있어요.  트렌디한 기술을 활용하여 서비스가 안정적으로 운영될 수 있도록 하며, 유저들의 보이스를 듣고 빠르고 유연하게 문제를 해결해요.    이런 분과 함께하고 싶어요    고가용성의 확장 가능한 시스템을 설계하고 운영해본 경험이 있는 분이 필요해요.  대규모의 실시간 트래픽을 처리하는 시스템 개발 경험이 있는 분이 필요해요.  장애를 경험하고 문제를 해결해보신 경험이 있는 분이 필요해요.  서비스에 대한 애착이 강해서 ‘내 서비스’라는 마음으로 일하는 분이 필요해요.  서비스 개발을 하면서 얻게 되는 새로운 인사이트나 아이디어에 대해서도 공유하며, 끊임없이 기술적인 도전을 하고 싶은 분과 함께하고 싶어요.    이력서는 이렇게 작성하시는 걸 추천해요    대용량 트래픽을 빠르고 안정적으로 처리할 수 있도록 고민하고 개발해본 경험이 필요해요.  문제를 발견해서 적극적으로 개선해본 경험이 있다면, 어떤 기술 스택을 사용하여 어느 정도 개선했는지 구체적으로 적어주세요!  서비스 초기단계에 참여해본 경험이 있다면 기술해주세요.  Spring Framework 기반의 B2C 서비스 개발 경험이 있다면 작성해 주세요.';

const JobTextUploader = () => {
  const MAX_LENGTH = 2500;
  const MIN_LENGTH = 100;

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  const [text, setText] = useState('');

  const [requestStage, setRequestStage] = useAtom(currentRequestStageAtom);

  const [resumeText] = useAtom(resumeTextAtom);

  const [submitting, setSubmitting] = useState(false);
  const nextButtonDisabled = text.length < MIN_LENGTH;
  const prevButtonDisabled = false;

  const createRequest = async () => {
    setSubmitting(true);

    const jobText = textareaRef.current?.value || '';

    console.log(jobText);
    console.log(resumeText);

    try {
      if (jobText.length < MIN_LENGTH) {
        setSubmitting(false);
        alert(`채용공고 내용을 최소 ${MIN_LENGTH}자 이상 입력해주세요.`);
        return;
      }

      const res = await generateQuestion({
        resume_text: resumeText,
        job_text: jobText,
      });

      setSubmitting(false);
      setRequestStage('beforeGenerating');

      router.replace(`/new-request/${res.request_id}`);
    } catch (error) {
      setSubmitting(false);
      alert('문제가 발생했어요. 다시 시도해주세요.');
    }
  };

  return (
    <>
      <div className={styles.main}>
        <p className={styles.title}>채용공고를 업로드하세요</p>
        <p className={styles.desc}>
          내가 준비하고 있는 기업의 채용공고 텍스트를 준비해주세요. 기업이
          원하는 인재상, 해당 직군이 필요로 하는 업무 등이 포함되면 좋아요.
        </p>

        <motion.div
          layout
          transition={{ layout: { duration: 0.25, ease: [0.2, 0.6, 0.2, 1] } }}
        >
          {/* 텍스트 입력 — 항상 마운트(포커스 유지), 접기/펼치기 */}
          <motion.section layout>
            <div className={styles.textInput}>
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                }}
                maxLength={MAX_LENGTH}
                minLength={MIN_LENGTH}
                spellCheck={false}
                placeholder="채용공고 내용을 입력하세요."
              />

              <div className={styles.textLength}>
                현재 {text.length.toLocaleString()}자 ·{' '}
                {text.length < MIN_LENGTH
                  ? `최소 ${MIN_LENGTH}자 필요`
                  : `최대 ${MAX_LENGTH.toLocaleString()}자 까지`}
              </div>
            </div>
          </motion.section>
        </motion.div>
      </div>
      <div className={styles.buttons}>
        <Button
          text="이전 단계로"
          disabled={prevButtonDisabled}
          color="gray"
          onClick={() => setRequestStage('resumeText')}
        />
        <Button
          text="다음"
          disabled={nextButtonDisabled}
          loading={submitting}
          onClick={() => {
            createRequest();
          }}
        />
      </div>
    </>
  );
};

export default JobTextUploader;
