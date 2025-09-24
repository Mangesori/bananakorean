import { makeMcqFromDialogue } from './utils';
import { existenceQuestions } from '@/data/quiz/dialogue/existence';

export const existenceMcqQuestions = makeMcqFromDialogue(existenceQuestions);
