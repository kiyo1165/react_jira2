import React, { useEffect } from "react";
import styles from "./App.module.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import { Adb, ExitToApp } from "@mui/icons-material";
import { Grid, Avatar } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";

import {
  selectLoginUser,
  selectProfiles,
  fetchAsyncGetMyProf,
  fetchAsyncGetProfs,
  fetchAsyncUpdateProf,
} from "./features/auth/authSlice";
import {
  fetchAsyncGetTasks,
  fetchAsyncGetUsers,
  fetchAsyncGetCategory,
  selectEditedTask,
  selectTasks,
} from "./features/task/taskSlice";

import TaskList from "./features/task/TaskList";
import TaskForm from "./features/task/TaskForm";
import TaskDisplay from "./features/task/TaskDisplay";

import { AppDispatch } from "./app/store";

const theme = createTheme({
  palette: {
    secondary: {
      main: "#3cb371",
    },
  },
});

const App: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const editedTask = useSelector(selectEditedTask);
  const tasks = useSelector(selectTasks);
  const loginUser = useSelector(selectLoginUser);
  const profiles = useSelector(selectProfiles);

  //ログインしているユーザーのプロフィールを取得
  const loginProfile = profiles.filter(
    (prof) => prof.user_profile === loginUser.id
  )[0];

  //logout
  const Logout = () => {
    localStorage.removeItem("localJWT");
    window.location.href = "/";
  };

  //写真の変更
  const handleEditPicture = () => {
    const fileInput = document.getElementById("imageInput"); //ファイルアップデート用のinput id指定
    fileInput?.click();
  };

  useEffect(() => {
    const fetchBootLoader = async () => {
      await dispatch(fetchAsyncGetTasks());
      await dispatch(fetchAsyncGetMyProf());
      await dispatch(fetchAsyncGetUsers());
      await dispatch(fetchAsyncGetCategory());
      await dispatch(fetchAsyncGetProfs());
    };
    fetchBootLoader();
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <div className={styles.app__root}>
        <Grid container>
          <Grid item xs={4}>
            <Adb />
          </Grid>
          <Grid item xs={4}>
            <h1>Scrum Task Board</h1>
          </Grid>
          <Grid item xs={4}>
            <div className={styles.app__logout}>
              <button className={styles.app__iconLogout} onClick={Logout}>
                <ExitToApp fontSize="large" />
              </button>

              <input
                type="file"
                id="imageInput"
                hidden={true}
                onChange={(e) => {
                  dispatch(
                    fetchAsyncUpdateProf({
                      id: loginProfile.id,
                      img: e.target.files !== null ? e.target.files[0] : null,
                    })
                  );
                }}
              />
              <button className={styles.app__btn} onClick={handleEditPicture}>
                <Avatar
                  sx={{ mx: 1 }}
                  alt="avatar"
                  src={
                    loginProfile?.img !== null ? loginProfile?.img : undefined
                  }
                />
              </button>
            </div>
          </Grid>
          <Grid item xs={6}>
            {/* タスクリストがあれば表示する。左辺がtrueの場合右辺を返( 論理積 (&&)) */}
            {tasks[0]?.task && <TaskList />}
          </Grid>
          <Grid item xs={6}>
            <Grid
              container
              direction="column"
              alignItems="center"
              justifyContent="center"
              style={{ minHeight: "80vh" }}
            >
              <Grid item>
                {editedTask.status ? <TaskForm /> : <TaskDisplay />}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </ThemeProvider>
  );
};

export default App;
