import Link from 'next/link';
import PageWrapper from '@/components/shared/wrappers/PageWrapper';

const multipleSets = [
  {
    id: 'introduction',
    title: 'Learn how to introduce yourself',
    description: '은/는, 이에요/예요 - Basic Copula',
    // 학생, 선생님, 의사, 가수, 요리사, 경찰, 회사원, 배우, 운동 선수, 기자
    // 한국 사람, 중국 사람, 일본 사람, 미국 사람, 영국 사람, 프랑스 사람, 독일 사람, 호주 사람, 베트남 사람, 인도 사람
  },
  {
    id: 'demonstratives',
    title: 'Learn how to use demonstrative pronouns',
    description: '이거, 그거, 저거 - This, That, That over there',
    // 이거, 그거, 저거, 책, 펜, 가방, 커피, 물, 책상, 의자, 빵, 우유, 핸드폰
  },
  {
    id: 'negation',
    title: 'Learn how to make negative statements',
    description: '이/가 아니에요 - Negative Copula',
    // 공책, 연필, 우산, 노트북, 시계, 에어컨,
  },
  {
    id: 'locations',
    title: 'Learn how to use location words',
    description: '여기, 거기, 저기 - Here, There, Over there',
    // 교실, 학교, 도서관, 화장실, 집, 회사, 식당, 카페, 병원, 영화관
  },
  {
    id: 'existence',
    title: 'Learn how to express existence',
    description: '에 있어요/없어요 - Existence/Non-existence',
    // 언니, 친구, 엄마, 아빠, 오빠, 휴지, 안경,
    // 라면, 우유, 맥주, 사과, 바나나, 포도
  },
  {
    id: 'basic-verbs',
    title: 'Learn how to use basic verbs',
    description: '을/를, 아요/어요 - Object Markers & Verb Endings',
    // 읽다, 마시다, 듣다, 공부하다, 보다, 만나다, 먹다, 사다, 좋아하다, 자다, 배우다, 공부하다, 쇼핑하다, 이야기하다, 운동하다, 요리하다, 일하다, 전화하다
    // 음악, 노래, 한국어, 영어, 밥, 피자, 아침, 점심, 저녁, 공부, 운동, 쇼핑, 이야기, 요리, 일, 전화
  },
  {
    id: 'negative-sentences',
    title: 'Learn how to make negative sentences',
    description: '안 - Negation Marker',
  },
  {
    id: 'movement',
    title: 'Learn how to express movement',
    description: '에 가요/와요 - Going/Coming to',
    // 친구 집, 쇼핑몰, 은행, 편의점, 서점,
    // 아들, 딸,
    // 오늘, 하고
    // 한국, 중국, 일본, 미국, 영국, 프랑스, 독일, 호주, 베트남, 인도
  },
  {
    id: 'location-actions',
    title: 'Learn how to describe locations & actions',
    description: '에서 - Location Marker for Actions',
    // 빌리다, 산책하다, 입다, 찾다, 만들다
    // 옷, 신발, 모자, 디저트, 수업, 돈, 음식
    // 한테,
  },
  {
    id: 'past-tense',
    title: 'Learn how to talk about the past',
    description: '았어요/었어요 - Past Tense',
    // 어제, 지난주, 이번 주, 지난달, 이번 달, 작년, 올해
  },
  {
    id: 'time-expressions',
    title: 'Learn how to express time',
    description: '에(시간) - Time Expressions',
    // 월요일, 화요일, 수요일, 목요일, 금요일, 토요일, 일요일
    // 1시, 2시, 3시, 4시, 5시, 6시, 7시, 8시, 9시, 10시, 11시, 12시
    // 오전, 오후, 주말
    // 오늘, 내일, 어제
    // 아침, 점심 ,저녁
    // 일어나다, 아르바이트하다, 노래를 부르다
    // 남자친구, 여자친구, 노래방, 회의, 파티, 콘서트
  },
  {
    id: 'duration',
    title: 'Learn how to express duration',
    description: '부터&까지 - From & Until',
    // 어제, 오늘, 내일
    // 지난주, 이번 주, 다음 주
    // 지난달, 이번 달, 다음 달
    // 작년, 올해, 내년
    // 1월, 2월, 3월, 4월, 5월, 6월, 7월, 8월, 9월, 10월, 11월, 12월
    // 1일, 2일, 3일, 4일, 5일, 6일, 7일, 8일, 9일, 10일, 11일, 12일, 13일, 14일, 15일, 16일, 17일, 18일, 19일, 20일, 21일, 22일, 23일, 24일, 25일, 26일, 27일, 28일, 29일, 30일, 31일
    // 1시, 2시, 3시, 4시, 5시, 6시, 7시, 8시, 9시, 10시, 11시, 12시
    // 월요일, 화요일, 수요일, 목요일, 금요일, 토요일, 일요일
    // 오전, 오후, 주말
    // 아침, 점심, 저녁
    // 읽다, 마시다, 듣다, 보다, 만나다, 먹다, 자다, 배우다, 공부하다, 쇼핑하다, 이야기하다, 운동하다, 요리하다, 일하다, 전화하다, 아르바이트하다, 산책하다, 여행을 가다
    // 책, 영화, 드라마, 술, 맥주, 소주, 와인, 밥, 한국어, 영어, 중국어, 일본어, 프랑스어, 독일어, 베트남어
    // 수업, 여행, 방학, 휴가, 콘서트, 공연
    // 도서관, 카페, 집, 영화관, 방, 식당, 학교, 회사, 공원, 헬스장, 학원, 사무실
    // 비가 오다, 눈이 오다, 살다, 문을 열다, 문을 닫다, 놀다, 시작하다, 시작되다, 끝내다, 끝나다
    // 한국, 중국, 일본, 미국, 영국, 프랑스, 독일, 호주, 베트남, 인도
  },
  {
    id: 'positions',
    title: 'Learn how to describe positions',
    description: '위&아래&앞&뒤 - Above, Below, Front, Back',
    // 위, 아래, 앞, 뒤, 옆, 왼쪽, 오른쪽, 안, 밖
    // 책, 책상, 의자, 펜, 가방, 노트북, 핸드폰, 모자, 우산, 컵, 쓰레기통, 침대, 베개, 고양이, 강아지
    // 학교, 교실, 도서관, 카페, 편의점, 식당, 회사, 사무실, 영화관, 서점, 은행, 화장실, 백화점, 쇼핑몰, 공원
  },
  {
    id: 'purpose',
    title: 'Learn how to express purpose',
    description: '으러 가요/와요 - Going/Coming to do',
    // 공부하다, 먹다, 운동하다, 사다, 배우다, 산책하다, 만나다, 보다,
    // 돈을 찾다, 돈을 보내다, 손을 씻다, 옷을 바꾸다, 머리를 자르다, 사진을 찍다,
    // 미용실, 사진관, 가게
  },
  {
    id: 'commands',
    title: 'Learn how to give commands & prohibitions',
    description: "으세요, 지 마세요 - Please do, Please don't",
    // 다리가 아프다, 머리가 아프다, 목이 마르다, 배가 고프다, 춥다, 덥다, 따뜻하다, 어둡다, 더럽다, 깨끗하다
    // 길을 읽어버리다, 잠이 오다, 잠을 못 자다,
    // 앉다, 쓰레기를 버리다, 담배를 피우다, 에어컨을 켜다, 에어컨을 끄다, 불을 켜다, 불을 끄다,
  },
  {
    id: 'start-end',
    title: 'Learn how to express starting & ending points',
    description: '에서&까지 - From & To',
    // 버스, 지하철, 자동차, 택시, 자전거, 오토바이, 기차, 비행기, 트램, 걸어서
    // 걸리다
  },
  {
    id: 'direction-method',
    title: 'Learn how to express direction, means, or method',
    description: '으로 - By means of, Through',
    // 제주도, 서울, 부산, 중국, 일본, 프랑스, 미국, 스페인, 이탈리아, 태국, 베트남, 싱가포르,
    // 왼쪽, 오른쪽
    // 올라가다, 올라오다, 내려가다, 내려오다
    // 숟가락, 젓가락, 칼, 포크, 나이프
    // 밀가루, 쌀, 과자, 카드, 현금,
    // 자르다, 시험을 보다, 그림을 그리다, 수업을 듣다, 대화하다, 결제하다,
  },
  {
    id: 'desires',
    title: 'Learn how to express desire',
    description: '고 싶다, 고 싶어하다 - Want to ~',
    // 창문, 자리,
    // 친구하고 놀다
  },
  {
    id: 'future',
    title: 'Learn how to talk about the future',
    description: '을 거예요 - Will ~',
    // 구경하다, 관광하다, 서핑하다, 스키를 타다, 스케이트를 타다, 택배를 보내다, 이사하다, 장을 보다, 출장을 가다, 학원에 다니다,
    // 근처, 새, 새로운,
    // 도시, 시골, 우체국, 스키장,
    // (이)랑,
  },
  {
    id: 'ability',
    title: 'Learn how to express ability & possibility',
    description: '수 있다/없다 - Can/Cannot',
    // (식당에) 들어가다, (한국어를) 연습하다, 고치다, (악기를) 불다, (악기를) 켜다, 도와주다, 기다리다
    // 동안, 일찍,
    // 피아노, 기타, 바이올린, 드럼, 프루트, 색소폰, 첼로, 하모니카,
  },
];

export default function MultipleIndexPage() {
  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Multiple Choice Quiz</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {multipleSets.map(set => (
            <Link
              key={set.id}
              href={`/quiz/multiple/${set.id}`}
              className="block p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">{set.title}</h2>
              <p className="text-gray-600">{set.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
