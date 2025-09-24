import { makeMcqFromDialogue } from './utils';
import { negationQuestions } from '@/data/quiz/dialogue/negation';

export const negationMcqQuestions = makeMcqFromDialogue(negationQuestions);
