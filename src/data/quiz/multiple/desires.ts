import { makeMcqFromDialogue } from './utils';
import { desireQuestions } from '@/data/quiz/DialogueDragAndDrop/desires';

export const desiresMcqQuestions = makeMcqFromDialogue(desireQuestions);
