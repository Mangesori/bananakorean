import { makeMcqFromDialogue } from './utils';
import { startEndQuestions } from '@/data/quiz/DialogueDragAndDrop/start-end';

export const startEndMcqQuestions = makeMcqFromDialogue(startEndQuestions);
