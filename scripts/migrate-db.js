#!/usr/bin/env node

/**
 * 데이터베이스 마이그레이션 스크립트
 * Supabase CLI를 사용하여 마이그레이션을 실행합니다.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 환경 변수 확인
function checkEnvironment() {
  const requiredEnvVars = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'];

  const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missing.length > 0) {
    console.error('❌ 다음 환경 변수가 설정되지 않았습니다:');
    missing.forEach(envVar => console.error(`   - ${envVar}`));
    console.error('\n.env.local 파일을 확인해주세요.');
    process.exit(1);
  }

  console.log('✅ 환경 변수 확인 완료');
}

// Supabase CLI 설치 확인
function checkSupabaseCLI() {
  try {
    execSync('supabase --version', { stdio: 'pipe' });
    console.log('✅ Supabase CLI 확인 완료');
  } catch (error) {
    console.error('❌ Supabase CLI가 설치되지 않았습니다.');
    console.error('다음 명령어로 설치해주세요:');
    console.error('npm install -g supabase');
    process.exit(1);
  }
}

// 마이그레이션 파일 확인
function checkMigrationFiles() {
  const migrationDir = path.join(process.cwd(), 'supabase', 'migrations');

  if (!fs.existsSync(migrationDir)) {
    console.log('📁 마이그레이션 디렉토리 생성 중...');
    fs.mkdirSync(migrationDir, { recursive: true });
  }

  const migrationFiles = fs.readdirSync(migrationDir).filter(file => file.endsWith('.sql'));

  if (migrationFiles.length === 0) {
    console.error('❌ 마이그레이션 파일이 없습니다.');
    process.exit(1);
  }

  console.log(`✅ ${migrationFiles.length}개의 마이그레이션 파일 발견`);
  migrationFiles.forEach(file => console.log(`   - ${file}`));

  return migrationFiles;
}

// Supabase 프로젝트 초기화
function initSupabaseProject() {
  try {
    console.log('🔧 Supabase 프로젝트 초기화 중...');

    // supabase 폴더가 없으면 초기화
    if (!fs.existsSync(path.join(process.cwd(), 'supabase'))) {
      execSync('supabase init', { stdio: 'inherit' });
    }

    console.log('✅ Supabase 프로젝트 초기화 완료');
  } catch (error) {
    console.error('❌ Supabase 프로젝트 초기화 실패:', error.message);
    process.exit(1);
  }
}

// 마이그레이션 실행
function runMigrations() {
  try {
    console.log('🚀 마이그레이션 실행 중...');

    // 로컬 Supabase 시작 (개발 환경에서만)
    if (process.env.NODE_ENV === 'development') {
      console.log('📦 로컬 Supabase 시작 중...');
      execSync('supabase start', { stdio: 'inherit' });
    }

    // 마이그레이션 적용
    console.log('📝 마이그레이션 적용 중...');
    execSync('supabase db reset', { stdio: 'inherit' });

    console.log('✅ 마이그레이션 완료');
  } catch (error) {
    console.error('❌ 마이그레이션 실행 실패:', error.message);
    process.exit(1);
  }
}

// 타입 생성
function generateTypes() {
  try {
    console.log('🔧 TypeScript 타입 생성 중...');
    execSync('supabase gen types typescript --local > src/types/supabase.ts', { stdio: 'inherit' });
    console.log('✅ TypeScript 타입 생성 완료');
  } catch (error) {
    console.warn('⚠️  타입 생성 실패 (선택사항):', error.message);
  }
}

// 메인 실행 함수
function main() {
  console.log('🎯 Banana Korean 데이터베이스 마이그레이션 시작\n');

  try {
    // 1. 환경 확인
    checkEnvironment();
    checkSupabaseCLI();

    // 2. 마이그레이션 파일 확인
    const migrationFiles = checkMigrationFiles();

    // 3. Supabase 프로젝트 초기화
    initSupabaseProject();

    // 4. 마이그레이션 실행
    runMigrations();

    // 5. 타입 생성
    generateTypes();

    console.log('\n🎉 데이터베이스 마이그레이션이 성공적으로 완료되었습니다!');
    console.log('\n다음 단계:');
    console.log('1. Supabase 대시보드에서 테이블 생성 확인');
    console.log('2. RLS 정책 확인');
    console.log('3. 애플리케이션에서 테스트');
  } catch (error) {
    console.error('\n❌ 마이그레이션 실패:', error.message);
    process.exit(1);
  }
}

// 스크립트 실행
if (require.main === module) {
  main();
}

module.exports = { main };
