import Link from 'next/link';
import PageWrapper from '@/components/shared/wrappers/PageWrapper';
import { topicMeta } from '@/data/quiz/topics/meta';

// introduction부터 ability까지 20개 문법
const fillBlankSets = [
  {
    id: 'introduction',
    title: 'Learn how to introduce yourself',
    description: '은/는, 이에요/예요 - Basic Copula',
  },
  {
    id: 'demonstratives',
    title: 'Learn how to use demonstrative pronouns',
    description: '이거, 그거, 저거 - This, That, That over there',
  },
  {
    id: 'negation',
    title: 'Learn how to make negative statements',
    description: '이/가 아니에요 - Negative Copula',
  },
  {
    id: 'locations',
    title: 'Learn how to use location words',
    description: '여기, 거기, 저기 - Here, There, Over there',
  },
  {
    id: 'existence',
    title: 'Learn how to express existence',
    description: '이/가 (Place)에 있어요/없어요 - Existence/Non-existence',
  },
  {
    id: 'basic-verbs',
    title: 'Learn how to use basic verbs',
    description: '을/를, 아요/어요 - Object Markers & Verb Endings',
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
  },
  {
    id: 'location-actions',
    title: 'Learn how to describe locations & actions',
    description: '에서 - Location Marker for Actions',
  },
  {
    id: 'past-tense',
    title: 'Learn how to talk about the past',
    description: '았어요/었어요 - Past Tense',
  },
  {
    id: 'time-expressions',
    title: 'Learn how to express time',
    description: '에(시간) - Time Expressions',
  },
  {
    id: 'duration',
    title: 'Learn how to express duration',
    description: '부터&까지 - From & Until',
  },
  {
    id: 'positions',
    title: 'Learn how to describe positions',
    description: '위&아래&앞&뒤 - Above, Below, Front, Back',
  },
  {
    id: 'purpose',
    title: 'Learn how to express purpose',
    description: '으러 가요/와요 - Going/Coming to do',
  },
  {
    id: 'commands',
    title: 'Learn how to give commands & prohibitions',
    description: "으세요, 지 마세요 - Please do, Please don't",
  },
  {
    id: 'start-end',
    title: 'Learn how to express starting & ending points',
    description: '에서&까지 - From & To',
  },
  {
    id: 'direction-method',
    title: 'Learn how to express direction, means, or method',
    description: '으로 - By means of, Through',
  },
  {
    id: 'desires',
    title: 'Learn how to express desire',
    description: '고 싶다, 고 싶어하다 - Want to ~',
  },
  {
    id: 'future',
    title: 'Learn how to talk about the future',
    description: '을 거예요 - Will ~',
  },
  {
    id: 'ability',
    title: 'Learn how to express ability & possibility',
    description: '수 있다/없다 - Can/Cannot',
  },
];

export default function FillBlankIndexPage() {
  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Fill in the Blank Quiz</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {fillBlankSets.map(set => (
            <Link
              key={set.id}
              href={`/quiz/fill-blank/${set.id}`}
              className="block p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2 text-blue-800">{set.title}</h2>
              <p className="text-gray-600">{set.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
