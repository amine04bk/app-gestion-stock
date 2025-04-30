import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("accessToken");
var idUser = localStorage.getItem("id");

export const loginFetch = createAsyncThunk("api/auth/signin", async (payload) => {
  const response = await fetch(Configuration.BACK_BASEURL + "api/auth/signin", {
    method: 'POST',
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  });
  const status = await response.status;
  var user = null;
  if (status === 200) {
    user = await response.json();
  }
  return { data: user, status: status };
});

export const verifyRefreshToken = createAsyncThunk("public/auth/access-token", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "public/auth/access-token", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(action)
  });
  const status = await response.status;
  var user = null;
  if (status === 200) {
    user = await response.json();
  }
  return { data: user, status: status };
});


export const getUsers = createAsyncThunk("user/retrieve-all-user", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "user/retrieve-all-user", {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },

  });
  const status = await response.status;
  var user = null;
  if (status === 200) {
    user = await response.json();
  }
  return { data: user, status: status };
});

export const addUser = createAsyncThunk("user/Add-user", async (action, { rejectWithValue }) => {
  try {
    const response = await fetch(Configuration.BACK_BASEURL + `user/Add-user`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(action)
    });

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData);
    }

    const user = await response.json();
    return user;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const addAbonnement = createAsyncThunk("user/addAbonnement", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + `user/addAbonnement`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(action)
  });
  const abonnement = await response.json();
  return abonnement;
});

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(Configuration.BACK_BASEURL + "user/deleteUser/" + id, {
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

export const getUserById = createAsyncThunk("user/getUserById", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "user/getUserById/" + id, {
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

/* export const getRole = createAsyncThunk("role/retrieve-all-role", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "role/retrieve-all-role", {
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
}); */

const usersReduce = createSlice({
  name: "users",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {
  },
  extraReducers: {
  },
});

export default usersReduce.reducer;
