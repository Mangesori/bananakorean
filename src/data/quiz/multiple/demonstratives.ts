import { makeMcqFromDialogue } from './utils';
import { demonstrativeQuestions } from '@/data/quiz/dialogue/demonstratives';

export const demonstrativesMcqQuestions = makeMcqFromDialogue(demonstrativeQuestions);
