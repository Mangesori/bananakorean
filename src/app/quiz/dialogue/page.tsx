import DialogueDragAndDrop from '@/components/quiz/DialogueDragAndDrop/DialogueDragAndDrop';
import { dialogueQuestions } from '@/data/quiz/dialogue';

export default function DialoguePage() {
  return (
    <div>
      <DialogueDragAndDrop questions={dialogueQuestions} title="Conversation Quiz" />
    </div>
  );
}
