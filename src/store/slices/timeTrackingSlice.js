import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  timeRecords: [],
  selectedTimeRecord: null,
  loading: false,
  error: null
};

const timeTrackingSlice = createSlice({
  name: 'timeTracking',
  initialState,
  reducers: {
    fetchTimeRecordsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchTimeRecordsSuccess: (state, action) => {
      state.loading = false;
      state.timeRecords = action.payload;
    },
    fetchTimeRecordsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addTimeRecordStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    addTimeRecordSuccess: (state, action) => {
      state.loading = false;
      state.timeRecords.push(action.payload);
    },
    addTimeRecordFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateTimeRecordStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateTimeRecordSuccess: (state, action) => {
      state.loading = false;
      const index = state.timeRecords.findIndex(record => record.time_id === action.payload.time_id);
      if (index !== -1) {
        state.timeRecords[index] = action.payload;
      }
    },
    updateTimeRecordFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteTimeRecordStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteTimeRecordSuccess: (state, action) => {
      state.loading = false;
      state.timeRecords = state.timeRecords.filter(record => record.time_id !== action.payload);
    },
    deleteTimeRecordFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setSelectedTimeRecord: (state, action) => {
      state.selectedTimeRecord = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const {
  fetchTimeRecordsStart,
  fetchTimeRecordsSuccess,
  fetchTimeRecordsFailure,
  addTimeRecordStart,
  addTimeRecordSuccess,
  addTimeRecordFailure,
  updateTimeRecordStart,
  updateTimeRecordSuccess,
  updateTimeRecordFailure,
  deleteTimeRecordStart,
  deleteTimeRecordSuccess,
  deleteTimeRecordFailure,
  setSelectedTimeRecord,
  clearError
} = timeTrackingSlice.actions;

export default timeTrackingSlice.reducer;