import { makeMcqFromDialogue } from './utils';
import { basicVerbQuestions } from '@/data/quiz/DialogueDragAndDrop/basic-verbs';

export const basicVerbsMcqQuestions = makeMcqFromDialogue(basicVerbQuestions);
