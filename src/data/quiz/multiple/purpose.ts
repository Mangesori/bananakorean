import { makeMcqFromDialogue } from './utils';
import { purposeQuestions } from '@/data/quiz/DialogueDragAndDrop/purpose';

export const purposeMcqQuestions = makeMcqFromDialogue(purposeQuestions);
