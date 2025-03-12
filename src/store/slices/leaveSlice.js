import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  leaves: [],
  selectedLeave: null,
  loading: false,
  error: null
};

const leaveSlice = createSlice({
  name: 'leaves',
  initialState,
  reducers: {
    fetchLeavesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchLeavesSuccess: (state, action) => {
      state.loading = false;
      state.leaves = action.payload;
    },
    fetchLeavesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addLeaveStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    addLeaveSuccess: (state, action) => {
      state.loading = false;
      state.leaves.push(action.payload);
    },
    addLeaveFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateLeaveStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateLeaveSuccess: (state, action) => {
      state.loading = false;
      const index = state.leaves.findIndex(leave => leave.leave_id === action.payload.leave_id);
      if (index !== -1) {
        state.leaves[index] = action.payload;
      }
    },
    updateLeaveFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteLeaveStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteLeaveSuccess: (state, action) => {
      state.loading = false;
      state.leaves = state.leaves.filter(leave => leave.leave_id !== action.payload);
    },
    deleteLeaveFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setSelectedLeave: (state, action) => {
      state.selectedLeave = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const {
  fetchLeavesStart,
  fetchLeavesSuccess,
  fetchLeavesFailure,
  addLeaveStart,
  addLeaveSuccess,
  addLeaveFailure,
  updateLeaveStart,
  updateLeaveSuccess,
  updateLeaveFailure,
  deleteLeaveStart,
  deleteLeaveSuccess,
  deleteLeaveFailure,
  setSelectedLeave,
  clearError
} = leaveSlice.actions;

export default leaveSlice.reducer;