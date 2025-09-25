import { makeMcqFromDialogue } from './utils';
import { timeExpressionQuestions } from '@/data/quiz/DialogueDragAndDrop/time-expressions';

export const timeExpressionsMcqQuestions = makeMcqFromDialogue(timeExpressionQuestions);
