import { configureStore } from '@reduxjs/toolkit';
import authReducer from './AuthSlice';
import BankReducer from './BankSlice'
import CustomerReducer from './CustomerSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    customers: CustomerReducer,
    banks:BankReducer,
  },
});

export default store;
