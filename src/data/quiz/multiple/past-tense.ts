import { makeMcqFromDialogue } from './utils';
import { pastTenseQuestions } from '@/data/quiz/dialogue/past-tense';

export const pastTenseMcqQuestions = makeMcqFromDialogue(pastTenseQuestions);
