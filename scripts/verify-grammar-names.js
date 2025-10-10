const fs = require('fs');
const path = require('path');

console.log('\n🔍 Verifying grammarName implementation...\n');

const folders = ['src/data/quiz/DialogueDragAndDrop'];

let totalFiles = 0;
let successCount = 0;
let errors = [];

folders.forEach(folder => {
  const folderPath = path.join(process.cwd(), folder);
  const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.ts'));

  files.forEach(file => {
    totalFiles++;
    const filePath = path.join(folderPath, file);
    const content = fs.readFileSync(filePath, 'utf8');

    // 1. addGrammarName import 확인
    const hasImport = content.includes('import { addGrammarName }');

    // 2. addGrammarName 사용 확인
    const hasUsage = content.match(
      /export const \w+Questions = addGrammarName\(questions, '[^']+'\);/
    );

    // 3. grammarName 필드가 남아있는지 확인
    const hasGrammarNameField = content.match(/grammarName:\s*['"][^'"]*['"]/);

    if (hasImport && hasUsage && !hasGrammarNameField) {
      successCount++;
      console.log(`  ✓ ${file}`);
    } else {
      errors.push({
        file,
        hasImport,
        hasUsage: !!hasUsage,
        hasGrammarNameField: !!hasGrammarNameField,
      });
      console.log(`  ❌ ${file}`);
      if (!hasImport) console.log(`     - Missing import`);
      if (!hasUsage) console.log(`     - Missing usage`);
      if (hasGrammarNameField) console.log(`     - Still has grammarName field`);
    }
  });
});

console.log(`\n📊 Results:`);
console.log(`   Total files: ${totalFiles}`);
console.log(`   Success: ${successCount}`);
console.log(`   Errors: ${errors.length}`);

if (errors.length > 0) {
  console.log(`\n❌ Files with issues:`);
  errors.forEach(err => {
    console.log(`   - ${err.file}:`, err);
  });
  process.exit(1);
} else {
  console.log(`\n✅ All files successfully migrated!`);
}
