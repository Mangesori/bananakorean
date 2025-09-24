import { makeMcqFromDialogue } from './utils';
import { purposeQuestions } from '@/data/quiz/dialogue/purpose';

export const purposeMcqQuestions = makeMcqFromDialogue(purposeQuestions);
