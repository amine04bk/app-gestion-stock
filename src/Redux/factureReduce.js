import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("accessToken");

export const getFactures = createAsyncThunk(
  "facture/getAllFacture",
  async (action) => {
    const response = await fetch(
      Configuration.BACK_BASEURL +
        "facture/getAllFacture/" +
        action.typeFacture,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const status = await response.status;
    var facture = null;
    if (status === 200) {
      facture = await response.json();
    }
    return { data: facture, status: status };
  }
);

export const addFactureWithLigneFactures = createAsyncThunk(
  "facture/addFactureWithLigneFactures",
  async ({
    fournisseur,
    commande,
    num,
    date,
    ligneFactures,
    mntTotalHT,
    mntTotalTVA,
    mntTotalTTC,
    typeFacture,
  }) => {
    console.log(ligneFactures);

    const response = await fetch(
      Configuration.BACK_BASEURL + `facture/saveWithLigneFactures`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          facture: {
            num,
            date,
            fournisseur,
            mntTotalHT,
            mntTotalTVA,
            mntTotalTTC,
            typeFacture,
            commande,
          },
          ligneFactures: ligneFactures.map((ls) => ({
            ressource: ls.ressourceId !== "" ? { id: ls.ressourceId } : null,
            qte: ls.qte,
            pu: ls.pu,
          })),
        }),
      }
    );
    const facture = await response.json();
    return facture;
  }
);

export const updateFactureWithLigneFactures = createAsyncThunk(
  "facture/updateFactureWithLigneFactures",
  async ({
    fournisseur,
    commande,
    id,
    num,
    date,
    ligneFactures,
    mntTotalHT,
    mntTotalTVA,
    mntTotalTTC,
    typeFacture,
  }) => {
    const response = await fetch(
      Configuration.BACK_BASEURL + `facture/updateWithLigneFactures/${id}`,
      {
        // Updated endpoint
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          facture: {
            fournisseur,
            commande,
            num,
            date,
            mntTotalHT,
            mntTotalTVA,
            mntTotalTTC,
            typeFacture,
          },
          ligneFactures: ligneFactures.map((ls) => ({
            ressource: ls.ressourceId !== "" ? { id: ls.ressourceId } : null,
            qte: ls.qte,
            pu: ls.pu,
          })),
        }),
      }
    );
    const facture = await response.json();
    return facture;
  }
);

export const getFactureWithLigneFactures = createAsyncThunk(
  "facture/getFactureWithLigneFactures",
  async (id) => {
    const response = await fetch(
      Configuration.BACK_BASEURL + `facture/getFactureWithLigneFactures/${id}`,
      {
        // Updated endpoint
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    return data;
  }
);

export const factureDeleted = createAsyncThunk(
  "facture/deleteFacture",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(
        Configuration.BACK_BASEURL + "facture/deleteFacture/" + id,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        return rejectWithValue({
          error: errorMessage,
          status: response.status,
        });
      }

      const regle = await response.json();
      return { data: regle, status: response.status };
    } catch (error) {
      return rejectWithValue({ error: error.message });
    }
  }
);

const factureReduce = createSlice({
  name: "factures",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {},
  extraReducers: {},
});

export default factureReduce.reducer;
