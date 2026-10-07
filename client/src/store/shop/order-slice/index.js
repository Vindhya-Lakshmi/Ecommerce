import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  orderId: null,
  orderList: [],
  orderDetails: null,
};

// Create COD order
export const createNewOrder = createAsyncThunk(
  "/order/createNewOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/shop/order/create",
        orderData,
        {
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      console.log("CREATE ORDER ERROR:", error.response?.data);

      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to create order",
        }
      );
    }
  }
);

// Get all orders of current user
export const getAllOrdersByUserId = createAsyncThunk(
  "/order/getAllOrdersByUserId",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/shop/order/list/${userId}`,
        {
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      console.log("GET ORDERS ERROR:", error.response?.data);

      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to get orders",
        }
      );
    }
  }
);

// Get single order details
export const getOrderDetails = createAsyncThunk(
  "/order/getOrderDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/shop/order/details/${id}`,
        {
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      console.log("GET ORDER DETAILS ERROR:", error.response?.data);

      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to get order details",
        }
      );
    }
  }
);

// Delete all orders
export const deleteAllOrders = createAsyncThunk(
  "/order/deleteAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        "http://localhost:5000/api/shop/order/delete-all",
        {
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      console.log("DELETE ALL ORDERS ERROR:", error.response?.data);

      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to delete all orders",
        }
      );
    }
  }
);

const shoppingOrderSlice = createSlice({
  name: "shoppingOrderSlice",

  initialState,

  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },

    resetOrderId: (state) => {
      state.orderId = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // CREATE ORDER
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isLoading = false;

        const newOrder = action.payload?.data;

        state.orderId = newOrder?._id || null;

        if (newOrder) {
          state.orderList.push(newOrder);
        }
      })

      .addCase(createNewOrder.rejected, (state) => {
        state.isLoading = false;
        state.orderId = null;
      })

      // GET ALL ORDERS
      .addCase(getAllOrdersByUserId.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(getAllOrdersByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload?.data || [];
      })

      .addCase(getAllOrdersByUserId.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })

      // GET ORDER DETAILS
      .addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload?.data || null;
      })

      .addCase(getOrderDetails.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      })

      // DELETE ALL ORDERS
      .addCase(deleteAllOrders.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(deleteAllOrders.fulfilled, (state, action) => {
        state.isLoading = false;

        if (action.payload?.success) {
          state.orderList = [];
          state.orderDetails = null;
          state.orderId = null;
        }
      })

      .addCase(deleteAllOrders.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const {
  resetOrderDetails,
  resetOrderId,
} = shoppingOrderSlice.actions;

export default shoppingOrderSlice.reducer;