import React, { useState } from "react";
import styles from "./Auth.module.css";
import { TextField, Button } from "@mui/material";
import Box from "@mui/material/Box";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import {
  toggleMode,
  fetchAsyncLogin,
  fetchAsyncRegister,
  fetchAsyncCreateProf,
  selectIsLoginView,
} from "./authSlice";

const Auth: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const isLoginView = useSelector(selectIsLoginView);
  const [credential, setCredential] = useState({ username: "", password: "" });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const name = e.target.name;
    setCredential({ ...credential, [name]: value });
  };

  const login = async () => {
    if (isLoginView) {
      //loginモード
      await dispatch(fetchAsyncLogin(credential));
    } else {
      //新規登録モード
      const result = await dispatch(fetchAsyncRegister(credential));
      if (fetchAsyncRegister.fulfilled.match(result)) {
        //match:resultと同じ値かを判定
        await dispatch(fetchAsyncLogin(credential)); //ログインを実行
        await dispatch(fetchAsyncCreateProf()); //プロフィールを作成
      }
    }
  };
  return (
    <div className={styles.auth__root}>
      <h1>{isLoginView ? "LOG IN" : "REGISTER"}</h1>
      <br />
      {/* 入力エリア */}
      <TextField
        InputLabelProps={{
          shrink: true,
        }}
        label="Username"
        type="text"
        name="username"
        variant="standard"
        value={credential.username}
        onChange={handleInput}
      />
      <br />
      <TextField
        InputLabelProps={{
          shrink: true,
        }}
        variant="standard"
        label="password"
        type="password"
        name="password"
        value={credential.password}
        onChange={handleInput}
      />
      <Button
        sx={{ my: 3 }}
        variant="contained"
        color="primary"
        size="small"
        onClick={login}
      >
        {isLoginView ? "LOG IN" : "REGISTER"}
      </Button>
      <span onClick={() => dispatch(toggleMode())}>
        {isLoginView ? "Create new account ?" : "Back to Login"}
      </span>
    </div>
  );
};

export default Auth;
