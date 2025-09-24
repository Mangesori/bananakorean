import { makeMcqFromDialogue } from './utils';
import { locationQuestions } from '@/data/quiz/dialogue/locations';

export const locationsMcqQuestions = makeMcqFromDialogue(locationQuestions);
