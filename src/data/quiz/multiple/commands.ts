import { makeMcqFromDialogue } from './utils';
import { commandQuestions } from '@/data/quiz/dialogue/commands';

export const commandsMcqQuestions = makeMcqFromDialogue(commandQuestions);
