import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import employeesReducer from './slices/employeesSlice';
import departmentReducer from './slices/departmentSlice';
import leaveReducer from './slices/leaveSlice';
import timeTrackingReducer from './slices/timeTrackingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employees: employeesReducer,
    departments: departmentReducer,
    leaves: leaveReducer,
    timeTracking: timeTrackingReducer
  }
});