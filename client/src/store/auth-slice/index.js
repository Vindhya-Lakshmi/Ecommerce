import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

export const registerUser = createAsyncThunk(
  "/auth/register",
  async (formData) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData,
        {
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      console.log("REGISTER ERROR:", error.response?.data);
      throw error;
    }
  }
);

export const loginUser = createAsyncThunk(
  "/auth/login",
  async (formData) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData,
        {
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      console.log("LOGIN ERROR:", error.response?.data);
      throw error;
    }
  }
);

export const logoutUser = createAsyncThunk(
  "/auth/logout",
  async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      console.log("LOGOUT ERROR:", error.response?.data);
      throw error;
    }
  }
);

export const checkAuth = createAsyncThunk(
  "/auth/checkauth",
  async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/auth/check-auth",
        {
          withCredentials: true,
          headers: {
            "Cache-Control":
              "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
        }
      );

      console.log("CHECK AUTH RESPONSE:", response.data);

      return response.data;
    } catch (error) {
      console.log("CHECK AUTH ERROR:", error.response?.data);
      throw error;
    }
  }
);

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },

  extraReducers: (builder) => {
    builder

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;

        state.user = action.payload.success
          ? action.payload.user
          : null;

        state.isAuthenticated = action.payload.success;
      })

      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      // CHECK AUTH
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(checkAuth.fulfilled, (state, action) => {
        console.log("CHECK AUTH RESPONSE:", action.payload);

        state.isLoading = false;

        state.user = action.payload.success
          ? action.payload.user
          : null;

        state.isAuthenticated = action.payload.success;
      })

      .addCase(checkAuth.rejected, (state, action) => {
        console.log("CHECK AUTH FAILED:", action.error);

        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      // LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setUser } = authSlice.actions;

export default authSlice.reducer;