import { makeMcqFromDialogue } from './utils';
import { introductionQuestions } from '@/data/quiz/dialogue/introduction';

export const introductionMcqQuestions = makeMcqFromDialogue(introductionQuestions);
