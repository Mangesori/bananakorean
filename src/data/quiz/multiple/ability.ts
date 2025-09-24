import { makeMcqFromDialogue } from './utils';
import { abilityQuestions } from '@/data/quiz/dialogue/ability';

export const abilityMcqQuestions = makeMcqFromDialogue(abilityQuestions);
