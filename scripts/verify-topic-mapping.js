const fs = require('fs');
const path = require('path');

console.log('\n🔍 Verifying topicId mappings with topicMeta...\n');

// topicMeta에서 정의된 topicIds
const validTopicIds = [
  'introduction',
  'demonstratives',
  'negation',
  'locations',
  'existence',
  'basic-verbs',
  'negative-sentences',
  'movement',
  'location-actions',
  'past-tense',
  'time-expressions',
  'duration',
  'positions',
  'purpose',
  'commands',
  'start-end',
  'direction-method',
  'desires',
  'future',
  'ability',
  'obligation',
  'skills',
  'adjectives',
  'progressive',
  'reasons',
  'contrast',
  'cause',
  'conditions',
  'time-relations',
  'sequence',
];

const folderPath = path.join(process.cwd(), 'src/data/quiz/DialogueDragAndDrop');
const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.ts'));

let allValid = true;

files.forEach(file => {
  const filePath = path.join(folderPath, file);
  const content = fs.readFileSync(filePath, 'utf8');

  // addGrammarName 사용에서 topicId 추출
  const match = content.match(/addGrammarName\(questions, '([^']+)'\)/);

  if (match) {
    const topicId = match[1];
    const isValid = validTopicIds.includes(topicId);

    if (isValid) {
      console.log(`  ✓ ${file.padEnd(30)} → '${topicId}'`);
    } else {
      console.log(`  ❌ ${file.padEnd(30)} → '${topicId}' (NOT IN topicMeta)`);
      allValid = false;
    }
  } else {
    console.log(`  ⚠️  ${file.padEnd(30)} → No topicId found`);
    allValid = false;
  }
});

console.log(`\n📊 Summary:`);
console.log(`   Total files: ${files.length}`);
console.log(`   Valid topicIds in topicMeta: ${validTopicIds.length}`);

if (allValid) {
  console.log(`\n✅ All topicId mappings are valid!`);
  console.log(`✅ grammarName will be automatically resolved from topicMeta!`);
} else {
  console.log(`\n❌ Some topicId mappings are invalid!`);
  process.exit(1);
}
