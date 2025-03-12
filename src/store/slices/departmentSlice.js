import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  departments: [],
  selectedDepartment: null,
  loading: false,
  error: null
};

const departmentSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {
    fetchDepartmentsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchDepartmentsSuccess: (state, action) => {
      state.loading = false;
      state.departments = action.payload;
    },
    fetchDepartmentsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addDepartmentStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    addDepartmentSuccess: (state, action) => {
      state.loading = false;
      state.departments.push(action.payload);
    },
    addDepartmentFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateDepartmentStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateDepartmentSuccess: (state, action) => {
      state.loading = false;
      const index = state.departments.findIndex(dept => dept.dept_id === action.payload.dept_id);
      if (index !== -1) {
        state.departments[index] = action.payload;
      }
    },
    updateDepartmentFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteDepartmentStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteDepartmentSuccess: (state, action) => {
      state.loading = false;
      state.departments = state.departments.filter(dept => dept.dept_id !== action.payload);
    },
    deleteDepartmentFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setSelectedDepartment: (state, action) => {
      state.selectedDepartment = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const {
  fetchDepartmentsStart,
  fetchDepartmentsSuccess,
  fetchDepartmentsFailure,
  addDepartmentStart,
  addDepartmentSuccess,
  addDepartmentFailure,
  updateDepartmentStart,
  updateDepartmentSuccess,
  updateDepartmentFailure,
  deleteDepartmentStart,
  deleteDepartmentSuccess,
  deleteDepartmentFailure,
  setSelectedDepartment,
  clearError
} = departmentSlice.actions;

export default departmentSlice.reducer;