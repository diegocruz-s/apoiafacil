import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginService } from "../services/auth";
import { api } from "../../utils/api";

export interface IAuth {
  email: string;
  password: string;
};

interface IDatasStorage {
  datas: {
    user: { _id: string, email: string };
    token: string;
  };
};

console.log('localStorage.getItem(\'datasStorage\'): ', localStorage.getItem('datasStorage'));

const datasUser: IDatasStorage = JSON.parse(localStorage.getItem('datasStorage') || '{}');

interface IInitialStates {
  error: string[] | null;
  success: string | null;
  loading: boolean;
  datasStorage?: IDatasStorage | null;
};

const initialStates: IInitialStates = {
  error: null,
  loading: false,
  success: null,
  datasStorage: datasUser,
};

export const login = createAsyncThunk(
  'auth/login',
  async (datas: IAuth, thunkAPI) => {
    resetStates();
    if(!datas) return;

    const res: IDatasStorage = await loginService(datas);
    if('errors' in res) return thunkAPI.rejectWithValue(res.errors);

    console.log('loginSlice: ', res);
    api.defaults.headers.authorization = `Bearer ${res.datas.token}`; 
    return res
  },
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    api.defaults.headers.authorization = ''; 
    await localStorage.removeItem('datasStorage');
  },
);

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialStates,
  reducers: {
    resetStates(states) {
      states.error = null;
      states.loading = false;
      states.success = null;
    },
  },
  extraReducers (builder) {
    builder
      .addCase(login.rejected, (state, { payload }) => {
        state.error = payload as string[];
        state.loading = false;
        state.success = null;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.success = null;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        const payloadDatas = payload as unknown as IDatasStorage;
        console.log('payloadDatas: ', payloadDatas);
        
        state.loading = false;
        state.error = null;
        state.datasStorage = payloadDatas;
        localStorage.setItem('datasStorage', JSON.stringify(payloadDatas));
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.success = null;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.error = null;
        state.loading = false;
        state.datasStorage = null;
      });
  },
});

export const { resetStates } = authSlice.actions;
export default authSlice.reducer;
