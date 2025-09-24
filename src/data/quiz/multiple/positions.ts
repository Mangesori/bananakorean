import { makeMcqFromDialogue } from './utils';
import { positionQuestions } from '@/data/quiz/dialogue/positions';

export const positionsMcqQuestions = makeMcqFromDialogue(positionQuestions);
