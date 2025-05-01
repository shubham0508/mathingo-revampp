import { createSlice } from '@reduxjs/toolkit';

const smartSolutionCheckSlice = createSlice({
  name: 'homeworkAssistant',
  initialState: {
    questions: [],
    answers: [],
  },
  reducers: {
    setQuestion: (state, action) => {
      state.questions = action.payload;
    },
    resetQuestion: (state) => {
      state.questions = [];
    },
    setAnswer: (state, action) => {
      state.answers = action.payload;
    },
    resetAnswer: (state) => {
      state.answers = [];
    },
  },
});

export const { setQuestion, resetQuestion, setAnswer, resetAnswer } =
  smartSolutionCheckSlice.actions;
export default smartSolutionCheckSlice.reducer;
