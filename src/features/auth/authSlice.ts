import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import {
  AUTH_STATE,
  CRED,
  LOGIN_USER,
  POST_PROFILE,
  JWT,
  USER,
  PROFILE,
} from "../types";

export const fetchAsyncLogin = createAsyncThunk(
  "auth/login",
  async (auth: CRED) => {
    const response = await axios.post<JWT>(
      `${process.env.REACT_APP_API_URL}authen/jwt/create/`,
      auth,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  }
);

export const fetchAsyncRegister = createAsyncThunk(
  "auth/register",
  async (auth: CRED) => {
    const response = await axios.post<USER>( //戻り値のデータ型
      `${process.env.REACT_APP_API_URL}api/create/`,
      auth,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  }
);

export const fetchAsyncGetMyProf = createAsyncThunk(
  "auth/loginuser",
  async () => {
    const response = await axios.get<LOGIN_USER>(
      `${process.env.REACT_APP_API_URL}api/loginuser/`,
      {
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return response.data;
  }
);

export const fetchAsyncCreateProf = createAsyncThunk(
  "auth/createprof",
  async () => {
    const response = await axios.post<PROFILE>(
      `${process.env.REACT_APP_API_URL}api/profile/`,
      { img: null }, //自動的に作成されるため最初はimgはnull
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return response.data;
  }
);

export const fetchAsyncGetProfs = createAsyncThunk("auth/profs", async () => {
  const response = await axios.get<PROFILE[]>(
    `${process.env.REACT_APP_API_URL}api/profile/`,
    {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    }
  );
  return response.data;
});

export const fetchAsyncUpdateProf = createAsyncThunk(
  "auth/updateprof",
  async (profile: POST_PROFILE) => {
    const uploadData = new FormData();
    //imgがある場合はappendしていく。
    profile.img && uploadData.append("img", profile.img, profile.img.name);
    const response = await axios.put<PROFILE>(
      `${process.env.REACT_APP_API_URL}api/profile/${profile.id}/`,
      uploadData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return response.data;
  }
);

const initialState: AUTH_STATE = {
  isLoginView: true,
  loginUser: {
    id: 0,
    username: "",
  },
  profiles: [{ id: 0, user_profile: 0, img: null }],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    toggleMode(state) {
      state.isLoginView = !state.isLoginView;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchAsyncLogin.fulfilled, //成功時
      (state, action: PayloadAction<JWT>) => {
        localStorage.setItem("localJWT", action.payload.access);
        action.payload.access && (window.location.href = "/tasks");
      }
    );
    builder.addCase(
      fetchAsyncGetMyProf.fulfilled,
      (state, action: PayloadAction<LOGIN_USER>) => {
        return {
          ...state,
          loginUser: action.payload,
        };
      }
    );
    builder.addCase(
      fetchAsyncGetProfs.fulfilled,
      (state, action: PayloadAction<PROFILE[]>) => {
        return {
          ...state,
          profiles: action.payload,
        };
      }
    );
    builder.addCase(
      fetchAsyncUpdateProf.fulfilled,
      (state, action: PayloadAction<PROFILE>) => {
        return {
          ...state,
          profiles: state.profiles.map((prof) =>
            //既存の配列を展開して一致したidを上書きして新しいオブジェクトを追加
            prof.id === action.payload.id ? action.payload : prof
          ),
        };
      }
    );
  },
});

//アクション(reducer)をエクスポート
export const { toggleMode } = authSlice.actions;

//useSelecterで利用するstateをエキスポート
export const selectIsLoginView = (state: RootState) => state.auth.isLoginView;
export const selectLoginUser = (state: RootState) => state.auth.loginUser;
export const selectProfiles = (state: RootState) => state.auth.profiles;

//storeに登録用
export default authSlice.reducer;
