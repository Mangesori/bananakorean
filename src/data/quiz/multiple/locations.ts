import { makeMcqFromDialogue } from './utils';
import { locationQuestions } from '@/data/quiz/DialogueDragAndDrop/locations';

export const locationsMcqQuestions = makeMcqFromDialogue(locationQuestions);
