import { chatCompletion } from './client';

/**
 * Translates Korean text to natural English using OpenAI GPT-5.2
 */
export async function translateKoreanToEnglish(text: string): Promise<string> {
  const prompt = `Translate the following Korean text to natural English.
Provide only the translation, no explanations.

Korean: ${text}
English:`;

  const translation = await chatCompletion(
    [{ role: 'user', content: prompt }],
    {
      temperature: 0.3,
      maxTokens: 200,
      model: 'gpt-5.2',
    }
  );

  return translation.trim();
}

/**
 * Translates multiple Korean texts to English in a single batch
 */
export async function batchTranslate(texts: string[]): Promise<string[]> {
  const prompt = `Translate the following Korean texts to natural English.
Provide each translation on a new line, in the same order.

${texts.map((text, i) => `${i + 1}. ${text}`).join('\n')}

Translations:`;

  const result = await chatCompletion(
    [{ role: 'user', content: prompt }],
    {
      temperature: 0.3,
      maxTokens: 500,
      model: 'gpt-5.2',
    }
  );

  // Split by newlines and clean up
  const translations = result
    .split('\n')
    .map(line => line.replace(/^\d+\.\s*/, '').trim())
    .filter(line => line.length > 0);

  return translations;
}
