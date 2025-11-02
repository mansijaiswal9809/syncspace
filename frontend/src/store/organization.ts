import { createSlice, createAsyncThunk,type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { Organization } from "../type";
import type { Project } from "../type";

interface OrganizationState {
  selectedOrganization: Organization | null;
  orgProjects: Project[];
  loading: boolean;
  error: string | null;
}

const initialState: OrganizationState = {
  selectedOrganization: null,
  orgProjects: [],
  loading: false,
  error: null,
};


export const fetchOrgProjects = createAsyncThunk<
  Project[],
  string,   
  { rejectValue: string }
>("organization/fetchOrgProjects", async (orgId, { rejectWithValue }) => {
  try {
    const res = await axios.get(`http://localhost:5000/api/projects?workspace=${orgId}`, {
      withCredentials: true,
    });
    return res.data; 
  } catch (err: any) {
    console.error("Error fetching org projects:", err);
    return rejectWithValue(err.response?.data?.error || "Failed to fetch projects");
  }
});


const organizationSlice = createSlice({
  name: "organization",
  initialState,
  reducers: {
    setSelectedOrganization: (state, action: PayloadAction<Organization>) => {
      console.log(action.payload, "selected org");
      state.selectedOrganization = action.payload;
    },
    clearSelectedOrganization: (state) => {
      state.selectedOrganization = null;
      state.orgProjects = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrgProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrgProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.orgProjects = action.payload;
      })
      .addCase(fetchOrgProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error fetching projects";
      });
  },
});

export const { setSelectedOrganization, clearSelectedOrganization } =
  organizationSlice.actions;

export default organizationSlice.reducer;
