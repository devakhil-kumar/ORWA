import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  visible: false,
  text: '',
  type: 'success',
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    showMessage: (state, action) => {
      state.visible = true;
      state.text = action.payload.text;
      state.type = action.payload.type || 'success';
    },
    hideMessage: (state) => {
      state.visible = false;
      state.text = '';
    },
  },
});

export const { showMessage, hideMessage } = messageSlice.actions;
export default messageSlice.reducer;
