import { makeMcqFromDialogue } from './utils';
import { commandQuestions } from '@/data/quiz/DialogueDragAndDrop/commands';

export const commandsMcqQuestions = makeMcqFromDialogue(commandQuestions);
