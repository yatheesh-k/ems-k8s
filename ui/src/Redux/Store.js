import { configureStore } from '@reduxjs/toolkit';
import authReducer from './AuthSlice';
import BankReducer from './BankSlice'
import CustomerReducer from './CustomerSlice';
import ProductReducer from './ProductSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    customers: CustomerReducer,
    banks:BankReducer,
    products:ProductReducer
  },
});

export default store;
