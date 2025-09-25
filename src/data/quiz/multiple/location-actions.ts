import { makeMcqFromDialogue } from './utils';
import { locationActionQuestions } from '@/data/quiz/DialogueDragAndDrop/location-actions';

export const locationActionsMcqQuestions = makeMcqFromDialogue(locationActionQuestions);
