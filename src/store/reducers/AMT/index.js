import { createSlice } from '@reduxjs/toolkit';

const aiMathTutorSlice = createSlice({
  name: 'aiMathTutor',
  initialState: {
    questions: [],
    answers: [],
    currentQuestion: null,
    currentFile: null,
    rawResponseData: null,
    solutionFeedback: null, // Added new key
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
      state.answers = action.payload;
      if (action.payload.files && action.payload.files.length > 0) {
        // Ensure pages and questions exist before accessing
        if (
          action.payload.files[0].pages &&
          action.payload.files[0].pages.length > 0 &&
          action.payload.files[0].pages[0].questions &&
          action.payload.files[0].pages[0].questions.length > 0
        ) {
          state.currentQuestion = action.payload.files[0].pages[0].questions[0];
        } else {
          state.currentQuestion = null; // Or some default
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
    setSolutionFeedback: (state, action) => {
      // Added new reducer
      state.solutionFeedback = action.payload;
    },
  },
});

const extractAllQuestions = (data) => {
  if (!data?.files) return [];

  return data.files.flatMap((file, fileIndex) =>
    file.pages.flatMap((page, pageIndex) =>
      page.questions.map((question, qIndex) => {
        const uniqueId = `${file.file_id}_${page.page_id || page.question_id}_${qIndex}`; // Use page_id if available

        return {
          uniqueId,
          question_id: page.question_id, // This might be the specific question identifier from the page
          original_index: qIndex,
          text: question,
          file_url: file.file_url,
          file_type: file.file_type,
          file_id: file.file_id, // This is the document ID
          image_id: page.image_id,
          page_no: page.page_no,
          fileIndex,
          pageIndex,
          checked: false,
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
  setSolutionFeedback, // Export new action
} = aiMathTutorSlice.actions;
export default aiMathTutorSlice.reducer;
