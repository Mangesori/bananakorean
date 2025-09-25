import { makeMcqFromDialogue } from './utils';
import { negativeSentenceQuestions } from '@/data/quiz/DialogueDragAndDrop/negative-sentences';

export const negativeSentencesMcqQuestions = makeMcqFromDialogue(negativeSentenceQuestions);
