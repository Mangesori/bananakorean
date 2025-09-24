import { makeMcqFromDialogue } from './utils';
import { timeExpressionQuestions } from '@/data/quiz/dialogue/time-expressions';

export const timeExpressionsMcqQuestions = makeMcqFromDialogue(timeExpressionQuestions);
