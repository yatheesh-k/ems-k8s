// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { BanksGetApi } from '../Utils/Axios';

// export const fetchBanks = createAsyncThunk('banks/fetchBanks', async () => {
//   try {
//     const response = await BanksGetApi();   // Call the banks API
//     console.log('Fetched banks data from AccountsSlice:', response.data.data);  // Log the banks data (make sure it's an array)
//     return response.data.data;  // Return the data
//   } catch (error) {
//     console.error('Error in fetchBanks thunk:', error);
//     throw new Error(error.response?.data?.message || 'Failed to fetch banks');
//   }
// });

// const BankSlice = createSlice({
//   name: 'banks',
//   initialState: {
//     banks: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchBanks.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchBanks.fulfilled, (state, action) => {
//         state.loading = false;
//         console.log('Action Payload (banks):', action.payload);  // Log the payload
//         state.banks = action.payload;
//         console.log('Updated banks in Redux state:', state.banks);
//       })
//       .addCase(fetchBanks.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;
//       });
//   },
// });

// export default BankSlice.reducer;
