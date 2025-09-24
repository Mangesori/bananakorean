import { makeMcqFromDialogue } from './utils';
import { basicVerbQuestions } from '@/data/quiz/dialogue/basic-verbs';

export const basicVerbsMcqQuestions = makeMcqFromDialogue(basicVerbQuestions);
