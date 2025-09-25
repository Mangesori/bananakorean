import { makeMcqFromDialogue } from './utils';
import { existenceQuestions } from '@/data/quiz/DialogueDragAndDrop/existence';

export const existenceMcqQuestions = makeMcqFromDialogue(existenceQuestions);
