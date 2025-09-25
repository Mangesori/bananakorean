import { makeMcqFromDialogue } from './utils';
import { demonstrativeQuestions } from '@/data/quiz/DialogueDragAndDrop/demonstratives';

export const demonstrativesMcqQuestions = makeMcqFromDialogue(demonstrativeQuestions);
