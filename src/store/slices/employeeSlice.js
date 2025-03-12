import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  employees: [],
  selectedEmployee: null,
  loading: false,
  error: null
};

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    fetchEmployeesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchEmployeesSuccess: (state, action) => {
      state.loading = false;
      state.employees = action.payload;
    },
    fetchEmployeesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addEmployeeStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    addEmployeeSuccess: (state, action) => {
      state.loading = false;
      state.employees.push(action.payload);
    },
    addEmployeeFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateEmployeeStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateEmployeeSuccess: (state, action) => {
      state.loading = false;
      const index = state.employees.findIndex(emp => emp.emp_id === action.payload.emp_id);
      if (index !== -1) {
        state.employees[index] = action.payload;
      }
    },
    updateEmployeeFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteEmployeeStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteEmployeeSuccess: (state, action) => {
      state.loading = false;
      state.employees = state.employees.filter(emp => emp.emp_id !== action.payload);
    },
    deleteEmployeeFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setSelectedEmployee: (state, action) => {
      state.selectedEmployee = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const {
  fetchEmployeesStart,
  fetchEmployeesSuccess,
  fetchEmployeesFailure,
  addEmployeeStart,
  addEmployeeSuccess,
  addEmployeeFailure,
  updateEmployeeStart,
  updateEmployeeSuccess,
  updateEmployeeFailure,
  deleteEmployeeStart,
  deleteEmployeeSuccess,
  deleteEmployeeFailure,
  setSelectedEmployee,
  clearError
} = employeeSlice.actions;

export default employeeSlice.reducer;