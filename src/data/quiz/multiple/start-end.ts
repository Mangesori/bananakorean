import { makeMcqFromDialogue } from './utils';
import { startEndQuestions } from '@/data/quiz/dialogue/start-end';

export const startEndMcqQuestions = makeMcqFromDialogue(startEndQuestions);
