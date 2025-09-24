import { makeMcqFromDialogue } from './utils';
import { negativeSentenceQuestions } from '@/data/quiz/dialogue/negative-sentences';

export const negativeSentencesMcqQuestions = makeMcqFromDialogue(negativeSentenceQuestions);
