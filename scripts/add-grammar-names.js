const fs = require('fs');
const path = require('path');

// 파일별 문법 이름 매핑 (DialogueDragAndDrop/page.tsx의 description과 일치)
const grammarNameMap = {
  'introduction.ts': '은/는, 이에요/예요',
  'demonstratives.ts': '이거, 그거, 저거',
  'negation.ts': '이/가 아니에요',
  'locations.ts': '여기, 거기, 저기',
  'existence.ts': '에 있어요/없어요',
  'basic-verbs.ts': '을/를, 아요/어요',
  'negative-sentences.ts': '안',
  'movement.ts': '(장소)에 가요/와요',
  'location-actions.ts': '(장소)에서',
  'past-tense.ts': '았어요/었어요',
  'time-expressions.ts': '(시간)에',
  'duration.ts': '부터&까지',
  'positions.ts': '위&아래&앞&뒤',
  'purpose.ts': '(으)러 가요/와요',
  'commands.ts': '(으)세요, 지 마세요',
  'start-end.ts': '에서&까지',
  'direction-method.ts': '(으)로',
  'desires.ts': '고 싶다, 고 싶어하다',
  'future.ts': '(으)ㄹ 거예요',
  'ability.ts': '(으)ㄹ 수 있다/없다',
  'obligation.ts': '아야/어야 해요',
  'skills.ts': '못하다&잘하다&잘 못하다',
  'adjectives.ts': '형용사 + (으)ㄴ',
  'progressive.ts': '고 있다',
  'reasons.ts': '아서/어서',
  'contrast.ts': '지만, 는데',
  'cause.ts': '(으)니까',
  'conditions.ts': '(으)면',
  'time-relations.ts': '(으)ㄹ 때',
  'sequence.ts': '기 전, (으)ㄴ 후',
};

// DialogueDragAndDrop, fill-blank, multiple 폴더 처리
const folders = [
  'src/data/quiz/DialogueDragAndDrop',
  'src/data/quiz/fill-blank',
  'src/data/quiz/multiple',
];

folders.forEach(folder => {
  const folderPath = path.join(process.cwd(), folder);

  if (!fs.existsSync(folderPath)) {
    console.log(`Folder not found: ${folderPath}`);
    return;
  }

  const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.ts'));

  files.forEach(file => {
    const filePath = path.join(folderPath, file);
    let content = fs.readFileSync(filePath, 'utf8');

    const grammarName = grammarNameMap[file];
    if (!grammarName) {
      console.log(`No grammar name mapping for: ${file}`);
      return;
    }

    // 이미 grammarName이 있는지 확인
    if (content.includes('grammarName:')) {
      console.log(`Already has grammarName: ${file}`);
      return;
    }

    // 패턴 매칭: answerTranslation 다음에 grammarName 추가
    // 모든 경우를 처리하는 포괄적인 정규식
    const regex = /(answerTranslation:\s*['"`][^'"`]*['"`],)(\s*(?:alternativeAnswers)?)/g;
    let newContent = content.replace(regex, (match, p1, p2) => {
      // grammarName이 이미 있는지 확인
      if (content.includes(`grammarName: '${grammarName}'`)) {
        return match;
      }
      return `${p1}\n    grammarName: '${grammarName}',${p2}`;
    });

    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`✓ Updated: ${folder}/${file} with grammarName: '${grammarName}'`);
    } else {
      console.log(`✗ No changes: ${folder}/${file}`);
    }
  });
});

console.log('\n✅ Grammar names added successfully!');
