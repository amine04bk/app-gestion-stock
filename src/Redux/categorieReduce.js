import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("accessToken");
var idCategorie = localStorage.getItem("id");


export const getCategories = createAsyncThunk("categorie/getAllCategorie", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "categorie/getAllCategorie", {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },

  });
  const status = await response.status;
  var cat = null;
  if (status === 200) {
    cat = await response.json();
  }
  
  return { data: cat, status: status };
});

export const addCategorie = createAsyncThunk("categorie/addCategorie", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + `categorie/addCategorie`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(action)
  });
  const categorie = await response.json();
  return categorie;
});

export const getCategorieById = createAsyncThunk("categorie/getCategorieById", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "categorie/getCategorieById/" + id, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  const status = await response.status;
  var cat = null;
  if (status === 200) {
    cat = await response.json();
  }
  return { data: cat, status: status };
}); 

export const categorieDeleted = createAsyncThunk(
  "categorie/deleteCategorie",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(Configuration.BACK_BASEURL + "categorie/deleteCategorie/" + id, {
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

      const cat = await response.json();
      return { data: cat, status: response.status };
    } catch (error) {
      return rejectWithValue({ error: error.message });
    }
  }
);

const categoriesReduce = createSlice({
  name: "categories",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {
  },
  extraReducers: {
  },
});

export default categoriesReduce.reducer;
