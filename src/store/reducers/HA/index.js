import { createSlice } from '@reduxjs/toolkit';

const homeworkAssistantSlice = createSlice({
  name: 'homeworkAssistant',
  initialState: {
    questions: [],
    answers: [],
    currentQuestion: null,
    currentFile: null,
    rawResponseData: null,
  },
  reducers: {
    setQuestion: (state, action) => {
      state.questions = extractAllQuestions(action.payload);
      state.currentFile = action.payload;
      state.rawResponseData = action.payload;
    },
    resetQuestion: (state) => {
      state.questions = [];
      state.currentFile = null;
      state.rawResponseData = null;
    },
    setAnswer: (state, action) => {
      const solutionsData = action.payload;
      const answersWithDifficulty = solutionsData.map((solution) => {
        const originalQuestionObject = state.questions.find(
          (q) =>
            q.question_id === solution.question_id &&
            q.text === solution.question,
        );

        const difficultyLevel = originalQuestionObject
          ? originalQuestionObject.question_difficulty_level
          : 'easy';

        return {
          ...solution,
          question_difficulty_level: difficultyLevel,
        };
      });

      state.answers = answersWithDifficulty;

      if (answersWithDifficulty.length > 0 && state.questions.length > 0) {
        const firstSolvedAnswer = answersWithDifficulty[0];
        const correspondingQuestionObject = state.questions.find(
          (q) =>
            q.question_id === firstSolvedAnswer.question_id &&
            q.text === firstSolvedAnswer.question,
        );

        if (correspondingQuestionObject) {
          state.currentQuestion = correspondingQuestionObject;
        } else if (
          state.questions.length === 1 &&
          answersWithDifficulty.length === 1
        ) {
          const fallbackMatch = state.questions.find(
            (q) => q.question_id === firstSolvedAnswer.question_id,
          );
          if (fallbackMatch) state.currentQuestion = fallbackMatch;
        }
      }
    },
    resetAnswer: (state) => {
      state.answers = [];
      state.currentQuestion = null;
    },
    setCurrentQuestion: (state, action) => {
      state.currentQuestion = action.payload;
    },
    toggleQuestionSelection: (state, action) => {
      const { questionId, isChecked } = action.payload;
      const questionIndex = state.questions.findIndex(
        (q) => q.uniqueId === questionId,
      );
      if (questionIndex !== -1) {
        state.questions[questionIndex].checked = isChecked;
      }
    },
  },
});

const extractAllQuestions = (data) => {
  if (!data?.files) return [];

  return data.files.flatMap((file, fileIndex) =>
    file.pages.flatMap((page, pageIndex) =>
      page.questions.map((questionText, qIndex) => {
        const uniqueId = `${file.file_id}_${page.question_id}_${qIndex}`;
        return {
          uniqueId,
          question_id: page.question_id,
          original_index: qIndex,
          text: questionText,
          file_url: file.file_url || 'no_input',
          file_type: file.file_type,
          file_id: file.file_id,
          image_id: page.image_id,
          page_no: page.page_no,
          fileIndex,
          pageIndex,
          checked: false,
          question_difficulty_level: page?.question_difficulty_level || 'easy',
        };
      }),
    ),
  );
};

export const {
  setQuestion,
  resetQuestion,
  setAnswer,
  resetAnswer,
  setCurrentQuestion,
  toggleQuestionSelection,
} = homeworkAssistantSlice.actions;
export default homeworkAssistantSlice.reducer;
