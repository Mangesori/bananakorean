import { makeMcqFromDialogue } from './utils';
import { durationQuestions } from '@/data/quiz/DialogueDragAndDrop/duration';

export const durationMcqQuestions = makeMcqFromDialogue(durationQuestions);
