import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("accessToken");

export const getCommandes = createAsyncThunk(
  "commande/getAllCommande",
  async (action) => {
    
    const response = await fetch(
      Configuration.BACK_BASEURL +
        "commande/getAllCommande/",
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
    var commande = null;
    if (status === 200) {
      commande = await response.json();
    }
    return { data: commande, status: status };
  }
);

export const addCommandeWithLigneCommandes = createAsyncThunk(
  "commande/addCommandeWithLigneCommandes",
  async ({ fournisseur, num, date, ligneCommandes, mntTotalHT, mntTotalTVA, mntTotalTTC }) => {
    const requestBody = JSON.stringify({
      commande: { num, date, fournisseur, mntTotalHT, mntTotalTVA, mntTotalTTC },
      ligneCommandes: ligneCommandes.map((ls) => {
        console.log("🟡 [PRODUIT DETAILS]:", ls.produit); // Log produit to check

        return {
          produit: ls.produit ? ls.produit : null, // Directly pass the product ID
          project: ls.projetId ? { id: ls.projetId } : null,
          qte: ls.qte,
          pu: ls.pu,
        };
      }),
    });

    console.log("🔵 [REQUEST BODY]:", requestBody); // Log the request body

    const response = await fetch(
      Configuration.BACK_BASEURL + `commande/saveWithLigneCommandes`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: requestBody,
      }
    );

    const responseData = await response.json();
    console.log("🟢 [RESPONSE]:", responseData); // Log response

    return responseData;
  }
);


export const updateCommandeWithLigneCommandes = createAsyncThunk(
  "commande/updateCommandeWithLigneCommandes",
  async ({
    id,
    fournisseur,
    num,
    date,
    ligneCommandes,
    mntTotalHT,
    mntTotalTVA,
    mntTotalTTC
  }) => {
    console.log(fournisseur);
    const response = await fetch(
      Configuration.BACK_BASEURL + `commande/updateWithLigneCommandes/${id}`,
      {
        // Updated endpoint
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          commande: {
            fournisseur,
            num,
            date,
            mntTotalHT,
            mntTotalTVA,
            mntTotalTTC
          },
          ligneCommandes: ligneCommandes.map((ls) => ({
            produit: ls.produitId !== undefined ? { id: ls.produitId } : null,
            project: ls.projetId !== undefined ? { id: ls.projetId } : null,
            qte: ls.qte,
            pu: ls.pu,
          })),
        }),
      }
    );
    const commande = await response.json();
    return commande;
  }
);

export const getCommandeWithLigneCommandes = createAsyncThunk(
  "commande/getCommandeWithLigneCommandes",
  async (id) => {
    const response = await fetch(
      Configuration.BACK_BASEURL + `commande/getCommandeWithLigneCommandes/${id}`,
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

export const commandeDeleted = createAsyncThunk(
  "commande/deleteCommande",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(
        Configuration.BACK_BASEURL + "commande/deleteCommande/" + id,
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

const commandeReduce = createSlice({
  name: "commandes",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {},
  extraReducers: {},
});

export default commandeReduce.reducer;
