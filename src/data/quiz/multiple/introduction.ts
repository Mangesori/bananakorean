import { makeMcqFromDialogue } from './utils';
import { introductionQuestions } from '@/data/quiz/DialogueDragAndDrop/introduction';

export const introductionMcqQuestions = makeMcqFromDialogue(introductionQuestions);
