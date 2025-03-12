import { createSlice } from '@reduxjs/toolkit';
import api from '../../utils/api';

const initialState = {
  employees: [],
  loading: false,
  error: null
};

const employeesSlice = createSlice({
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
    }
  }
});

export const { fetchEmployeesStart, fetchEmployeesSuccess, fetchEmployeesFailure } = employeesSlice.actions;

export const fetchEmployees = () => async (dispatch) => {
  try {
    dispatch(fetchEmployeesStart());
    const response = await api.get('/api/employees');
    dispatch(fetchEmployeesSuccess(response.data));
  } catch (error) {
    dispatch(fetchEmployeesFailure(error.message));
  }
};

export default employeesSlice.reducer;