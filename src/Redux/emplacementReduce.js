import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("accessToken");
var idEmplacement = localStorage.getItem("id");


export const getEmplacements = createAsyncThunk("emplacement/getAllEmplacement", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "emplacement/getAllEmplacement", {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },

  });
  const status = await response.status;
  var emplacement = null;
  if (status === 200) {
    emplacement = await response.json();
  }
  
  return { data: emplacement, status: status };
});

export const addEmplacement = createAsyncThunk("emplacement/addEmplacement", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + `emplacement/addEmplacement`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(action)
  });
  const emplacement = await response.json();
  return emplacement;
});

export const getEmplacementById = createAsyncThunk("emplacement/getEmplacementById", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "emplacement/getEmplacementById/" + id, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  const status = await response.status;
  var emplacement = null;
  if (status === 200) {
    emplacement = await response.json();
  }
  return { data: emplacement, status: status };
});


export const deleteEmplacement = createAsyncThunk("emplacement/deleteEmplacement", async (emplacement, { rejectWithValue }) => {
 
  try {
    // Extraire l'identifiant depuis l'objet
    const { id } = emplacement; // Assurez-vous que emplacement est un objet avec un champ id
    console.log("ID extrait :", id); // Vérifiez que l'id est correctement extrait

    const response = await fetch(Configuration.BACK_BASEURL + "emplacement/deleteEmplacement/" + id, {
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
});
const emplacementsReduce = createSlice({
  name: "emplacements",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {
  },
  extraReducers: {
  },
});

export default emplacementsReduce.reducer;
