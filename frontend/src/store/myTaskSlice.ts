import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";
import type { Task } from "../type";

export const fetchTasks = createAsyncThunk<
  Task[],
  string, // the argument type — selectedOrgId
  { rejectValue: string }
>("tasks/fetchTasks", async (selectedOrgId, { rejectWithValue }) => {
  try {
    const res = await axios.get<Task[]>(
      `http://localhost:5000/api/tasks/organization/${selectedOrgId}`,
      { withCredentials: true }
    );
    return res.data;
  } catch (error: any) {
    console.error("Error fetching tasks:", error);
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch tasks"
    );
  }
});

// Slice state
interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

// Create the slice
const myTaskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    clearTasks: (state) => {
      state.tasks = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
        state.tasks = [];
      });
  },
});

export const { clearTasks } = myTaskSlice.actions;
export default myTaskSlice.reducer;
