import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { analyzeVocabulary } from '@/lib/ai/vocabulary-analyzer';
import { loadTemplatesByGrammarTopics } from '@/lib/ai/template-loader';
import { matchVocabularyToTemplates } from '@/lib/ai/template-matcher';
import { generateMultipleProblems } from '@/lib/ai/quiz-generator';
import { estimateCost } from '@/lib/ai/client';
import {
  TemplateGenerationRequest,
  TemplateGenerationTestResponse,
} from '@/types/ai-test';
import { DialogueQuestion } from '@/types/quiz';

/**
 * POST: 템플릿 기반 퀴즈 생성
 * 어휘를 분석하고, 템플릿과 매칭하여 새로운 문제 생성
 */
export async function POST(request: NextRequest) {
  try {
    // 2. 요청 파라미터 파싱 (인증 전에 mode 확인을 위해)
    const body: TemplateGenerationRequest = await request.json();
    const { mode = 'production' } = body;

    // 1. 인증 확인 (테스트 모드가 아닐 때만)
    if (mode !== 'test') {
      const supabase = createClient();
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
      }
    }

    // 3. 요청 파라미터 추출
    const {
      vocabularyWords,
      grammarTopics,
      numberOfTemplates = 5,
      numberOfProblems = 2,
      model = 'gpt-4o-mini',
    } = body;

    // 4. 입력 검증
    if (!vocabularyWords || vocabularyWords.length === 0) {
      return NextResponse.json({ error: '어휘를 입력해주세요.' }, { status: 400 });
    }

    if (!grammarTopics || grammarTopics.length === 0) {
      return NextResponse.json({ error: '문법 주제를 선택해주세요.' }, { status: 400 });
    }

    // 5. 어휘 분석 (AI가 품사 자동 분석)
    console.log('어휘 분석 시작:', vocabularyWords);
    const analysisResult = await analyzeVocabulary(vocabularyWords);
    console.log('어휘 분석 완료:', analysisResult);

    // 6. 템플릿 로드 (선택한 문법 주제들만)
    console.log('템플릿 로드 시작:', grammarTopics);
    const allTemplates = await loadTemplatesByGrammarTopics(grammarTopics);

    if (allTemplates.length === 0) {
      return NextResponse.json(
        { error: '템플릿을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    console.log('총 템플릿 로드 완료:', allTemplates.length);

    // 7. 어휘와 템플릿 매칭 (numberOfProblems 개수만큼, grammarTopics 가중치 적용)
    console.log('템플릿 매칭 시작');
    const matchedTemplates = matchVocabularyToTemplates(
      analysisResult.words,
      allTemplates,
      numberOfProblems,  // numberOfProblems 파라미터 전달
      grammarTopics      // grammarTopics 파라미터 전달 (문법 가중치 + 새/기존 비율)
    );
    console.log('템플릿 매칭 완료:', matchedTemplates.length);

    if (matchedTemplates.length === 0) {
      return NextResponse.json(
        { error: '매칭되는 템플릿이 없습니다.' },
        { status: 404 }
      );
    }

    // 8. 문제 생성
    console.log('문제 생성 시작:', matchedTemplates.length);
    const generatedProblems = await generateMultipleProblems(
      matchedTemplates,
      analysisResult.words,
      model,
      allTemplates // 전체 템플릿 목록 전달 (재시도 시 다른 템플릿 선택용)
    );
    console.log('문제 생성 완료:', generatedProblems.length);

    // 9. 통계 계산
    const totalTokens = generatedProblems.reduce(
      (sum, p) => sum + p.metadata.tokensUsed,
      0
    );
    const estimatedCost = estimateCost(totalTokens, model);
    const successRate =
      generatedProblems.length > 0
        ? Math.round((generatedProblems.length / numberOfProblems) * 100)
        : 0;

    // 10. 응답 구성
    const response: TemplateGenerationTestResponse = {
      success: true,
      mode: mode as 'test' | 'production',
      analysis: {
        vocabulary: analysisResult.words,
      },
      generatedProblems,
      statistics: {
        templatesUsed: allTemplates.length,
        problemsGenerated: generatedProblems.length,
        successRate,
        totalTokens,
        estimatedCost: `$${estimatedCost.toFixed(6)}`,
        vocabularyCount: vocabularyWords.length,
      },
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('퀴즈 생성 오류:', error);

    // OpenAI API 키 관련 오류
    if (error.message?.includes('OPENAI_API_KEY')) {
      return NextResponse.json(
        {
          error: 'OpenAI API 키가 설정되지 않았습니다.',
          message: '.env.local 파일에 OPENAI_API_KEY를 추가해주세요.',
        },
        { status: 500 }
      );
    }

    // 템플릿 로드 오류
    if (error.message?.includes('템플릿')) {
      return NextResponse.json(
        {
          error: '템플릿 로드 실패',
          message: error.message,
        },
        { status: 500 }
      );
    }

    // 일반 오류
    return NextResponse.json(
      {
        error: '퀴즈 생성 실패',
        message: error.message || '알 수 없는 오류가 발생했습니다.',
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}
