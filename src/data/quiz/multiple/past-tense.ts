import { makeMcqFromDialogue } from './utils';
import { pastTenseQuestions } from '@/data/quiz/DialogueDragAndDrop/past-tense';

export const pastTenseMcqQuestions = makeMcqFromDialogue(pastTenseQuestions);
