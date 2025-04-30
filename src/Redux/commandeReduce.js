import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("accessToken");

export const getCommandes = createAsyncThunk(
  "commande/getAllCommande",
  async (action) => {
    const response = await fetch(
      Configuration.BACK_BASEURL + "commande/getAllCommande/",
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
    console.log(response);

    var commande = null;
    if (status === 200) {
      commande = await response.json();
      console.log(commande);
    }
    return { data: commande, status: status };
  }
);

export const addCommandeWithLigneCommandes = createAsyncThunk(
  "commande/addCommandeWithLigneCommandes",
  async ({
    fournisseur,
    num,
    date,
    ligneCommandes,
    mntTotalHT,
    mntTotalTVA,
    mntTotalTTC,
  }) => {
    const requestBody = JSON.stringify({
      commande: {
        num,
        date,
        fournisseur,
        mntTotalHT,
        mntTotalTVA,
        mntTotalTTC,
      },
      ligneCommandes: ligneCommandes.map((ls) => {
        console.log("🟡 [PRODUIT DETAILS]:", ls.produit);
        return {
          produit: ls.produit ? ls.produit : null,
          project: ls.projetId ? { id: ls.projetId } : null,
          ressource: ls.ressourceId ? { id: ls.ressourceId } : null,
          qte: ls.qte,
          pu: ls.pu,
        };
      }),
    });

    console.log("🔵 [REQUEST BODY]:", requestBody);

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
    console.log("🟢 [RESPONSE]:", responseData);
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
    mntTotalTTC,
  }) => {
    console.log(fournisseur);
    const response = await fetch(
      Configuration.BACK_BASEURL + `commande/updateWithLigneCommandes/${id}`,
      {
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
            mntTotalTTC,
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
      Configuration.BACK_BASEURL +
        `commande/getCommandeWithLigneCommandes/${id}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    console.log(data);
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
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle getCommandes
      .addCase(getCommandes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCommandes.fulfilled, (state, action) => {
        state.loading = false;
        state.entities = action.payload.data || [];
      })
      .addCase(getCommandes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.entities = [];
      })
      // Handle addCommandeWithLigneCommandes
      .addCase(addCommandeWithLigneCommandes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCommandeWithLigneCommandes.fulfilled, (state, action) => {
        state.loading = false;
        state.entities.push(action.payload);
      })
      .addCase(addCommandeWithLigneCommandes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Handle updateCommandeWithLigneCommandes
      .addCase(updateCommandeWithLigneCommandes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCommandeWithLigneCommandes.fulfilled, (state, action) => {
        state.loading = false;
        const updatedCommande = action.payload;
        const index = state.entities.findIndex(
          (cmd) => cmd.id === updatedCommande.id
        );
        if (index !== -1) {
          state.entities[index] = updatedCommande;
        }
      })
      .addCase(updateCommandeWithLigneCommandes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Handle getCommandeWithLigneCommandes
      .addCase(getCommandeWithLigneCommandes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCommandeWithLigneCommandes.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally update entities if needed
      })
      .addCase(getCommandeWithLigneCommandes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Handle commandeDeleted
      .addCase(commandeDeleted.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(commandeDeleted.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.meta.arg;
        state.entities = state.entities.filter((cmd) => cmd.id !== id);
      })
      .addCase(commandeDeleted.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || action.error.message;
      });
  },
});

export default commandeReduce.reducer;