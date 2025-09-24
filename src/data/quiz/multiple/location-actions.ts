import { makeMcqFromDialogue } from './utils';
import { locationActionQuestions } from '@/data/quiz/dialogue/location-actions';

export const locationActionsMcqQuestions = makeMcqFromDialogue(locationActionQuestions);
