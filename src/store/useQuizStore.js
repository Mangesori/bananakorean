import { create } from "zustand";

const useQuizStore = create((set) => ({
  quizType: null,
  level: null,
  grammarTopic: null,
  stage: null,
  questionCount: 10,
  questionType: null,
  answers: [],
  currentScore: 0,

  setQuizType: (type) => set({ quizType: type }),
  setLevel: (level) => set({ level: level }),
  setGrammarTopic: (topic) => set({ grammarTopic: topic }),
  setStage: (stage) => set({ stage: stage }),
  setQuestionCount: (count) => set({ questionCount: count }),
  setQuestionType: (type) => set({ questionType: type }),
  setAnswers: (answers) => set({ answers: answers }),
  setCurrentScore: (score) => set({ currentScore: score }),

  resetQuiz: () =>
    set({
      quizType: null,
      level: null,
      grammarTopic: null,
      stage: null,
      questionCount: 10,
      questionType: null,
      answers: [],
      currentScore: 0,
    }),
}));

export default useQuizStore;
