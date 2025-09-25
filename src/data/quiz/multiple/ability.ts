import { makeMcqFromDialogue } from './utils';
import { abilityQuestions } from '@/data/quiz/DialogueDragAndDrop/ability';

export const abilityMcqQuestions = makeMcqFromDialogue(abilityQuestions);
