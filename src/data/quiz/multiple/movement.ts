import { makeMcqFromDialogue } from './utils';
import { movementQuestions } from '@/data/quiz/dialogue/movement';

export const movementMcqQuestions = makeMcqFromDialogue(movementQuestions);
