import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("accessToken");
var idRessource = localStorage.getItem("id");


export const getRessources = createAsyncThunk("ressource/getAllRessource", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "ressource/getAllRessource", {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },

  });
  const status = await response.status;
  var ressource = null;
  if (status === 200) {
    ressource = await response.json();
  }
  
  return { data: ressource, status: status };
});

export const addRessource = createAsyncThunk("ressource/addRessource", async (action) => {
  console.log(action)
  const response = await fetch(Configuration.BACK_BASEURL + `ressource/addRessource`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(action)
  });
  const ressource = await response.json();
  return ressource;
});

export const getRessourceById = createAsyncThunk("ressource/getRessourceById", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "ressource/getRessourceById/" + id, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  const status = await response.status;
  var p = null;
  if (status === 200) {
    p = await response.json();
  }
  return { data: p, status: status };
}); 

export const ressourceDeleted = createAsyncThunk(
  "ressource/deleteRessource",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(Configuration.BACK_BASEURL + "ressource/deleteRessource/" + id, {
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

      const p = await response.json();
      return { data: p, status: response.status };
    } catch (error) {
      return rejectWithValue({ error: error.message });
    }
  }
);

const RessourcesReduce = createSlice({
  name: "Ressources",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {
  },
  extraReducers: {
  },
});

export default RessourcesReduce.reducer;
