import { makeMcqFromDialogue } from './utils';
import { movementQuestions } from '@/data/quiz/DialogueDragAndDrop/movement';

export const movementMcqQuestions = makeMcqFromDialogue(movementQuestions);
