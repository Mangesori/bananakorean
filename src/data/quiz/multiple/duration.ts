import { makeMcqFromDialogue } from './utils';
import { durationQuestions } from '@/data/quiz/dialogue/duration';

export const durationMcqQuestions = makeMcqFromDialogue(durationQuestions);
