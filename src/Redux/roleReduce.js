import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("accessToken");
var idrole = localStorage.getItem("id");


export const getRoles = createAsyncThunk("role/getAllRole", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "role/getAllRole", {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },

  });
  const status = await response.status;
  var role = null;
  if (status === 200) {
    role = await response.json();
  }
  return { data: role, status: status };
});

export const addRole = createAsyncThunk("role/addRole", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + `role/addRole`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(action)
  });
  const role = await response.json();
  return role;
});

export const getRoleById = createAsyncThunk("role/getRoleById", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "role/getRoleById/" + action.id, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  const status = await response.status;
  var regle = null;
  if (status === 200) {
    regle = await response.json();
  }
  return { data: regle, status: status };
}); 


export const roleDeleted = createAsyncThunk(
  "role/deleteRole",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(Configuration.BACK_BASEURL + "role/deleteRole/" + id, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        return rejectWithValue({ error: errorMessage, status: response.status });
      }

      const regle = await response.json();
      return { data: regle, status: response.status };
    } catch (error) {
      return rejectWithValue({ error: error.message });
    }
  }
);


const rolesReduce = createSlice({
  name: "roles",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {
  },
  extraReducers: {
  },
});

export default rolesReduce.reducer;
