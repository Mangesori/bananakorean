import { makeMcqFromDialogue } from './utils';
import { desireQuestions } from '@/data/quiz/dialogue/desires';

export const desiresMcqQuestions = makeMcqFromDialogue(desireQuestions);
