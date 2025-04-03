import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("accessToken");
var idFournisseur = localStorage.getItem("id");


export const getFournisseurs = createAsyncThunk("fournisseur/getAllFournisseur", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "fournisseur/getAllFournisseur", {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },

  });
  const status = await response.status;
  var Fournisseur = null;
  if (status === 200) {
    Fournisseur = await response.json();
  }
  return { data: Fournisseur, status: status };
});

export const addFournisseur = createAsyncThunk("fournisseur/addFournisseur", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + `fournisseur/addFournisseur`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(action)
  });
  const fournisseur = await response.json();
  return fournisseur;
});

export const getFournisseurById = createAsyncThunk("fournisseur/getFournisseurById", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "fournisseur/getFournisseurById/" + id, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  const status = await response.status;
  var frs = null;
  if (status === 200) {
    frs = await response.json();
  }
  return { data: frs, status: status };
}); 

export const fournisseurDeleted = createAsyncThunk(
  "fournisseur/deleteFournisseur",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(Configuration.BACK_BASEURL + "fournisseur/deleteFournisseur/" + id, {
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

      const s = await response.json();
      return { data: s, status: response.status };
    } catch (error) {
      return rejectWithValue({ error: error.message });
    }
  }
);



const fournisseursReduce = createSlice({
  name: "fournisseurs",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {
  },
  extraReducers: {
  },
});

export default fournisseursReduce.reducer;
