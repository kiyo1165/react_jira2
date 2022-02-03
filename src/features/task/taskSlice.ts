import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";

import { READ_TASK, POST_TASK, TASK_STATE, USER, CATEGORY } from "../types";

export const fetchAsyncGetTasks = createAsyncThunk("task/get", async () => {
  const response = await axios.get<READ_TASK[]>(
    `${process.env.REACT_APP_API_URL}api/tasks/`,
    {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    }
  );
  return response.data;
});

//ユーザー一覧
export const fetchAsyncGetUsers = createAsyncThunk(
  "task/getUsers",
  async () => {
    const response = await axios.get<USER[]>(
      `${process.env.REACT_APP_API_URL}api/users/`,
      {
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return response.data;
  }
);

//カテゴリー一覧
export const fetchAsyncGetCategory = createAsyncThunk(
  "task/getCategory",
  async () => {
    const response = await axios.get<CATEGORY[]>(
      `${process.env.REACT_APP_API_URL}api/category/`,
      {
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return response.data;
  }
);

//カテゴリーの新規作成
export const fetchAsyncCreateCategory = createAsyncThunk(
  "task/createCategory",
  async (item: string) => {
    const response = await axios.post<CATEGORY>(
      `${process.env.REACT_APP_API_URL}api/category/`,
      { item: item },
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

//タスクの新規作成
export const fetchAsyncCreateTask = createAsyncThunk(
  "task/createTask",
  async (task: POST_TASK) => {
    const response = await axios.post<READ_TASK>(
      `${process.env.REACT_APP_API_URL}api/category/`,
      task,
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

//タスクの更新
export const fetchAsyncUpdateTask = createAsyncThunk(
  "task/updateTask",
  async (task: POST_TASK) => {
    const response = await axios.put<READ_TASK>(
      `${process.env.REACT_APP_API_URL}api/tasks/${task.id}`,
      task,
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

//タスクの削除
export const fetchAsyncDeleteTask = createAsyncThunk(
  "task/deleteTask",
  async (id: number) => {
    await axios.delete(`${process.env.REACT_APP_API_URL}api/tasks/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return id;
  }
);

export const initialState: TASK_STATE = {
  tasks: [
    {
      id: 0,
      task: "",
      description: "",
      criteria: "",
      status: "",
      status_name: "",
      category: 0,
      category_item: "",
      estimate: 0,
      responsible: 0,
      responsible_username: "",
      owner: 0,
      owner_username: "",
      created_at: "",
      updated_at: "",
    },
  ],
  editedTask: {
    id: 0,
    task: "",
    description: "",
    criteria: "",
    status: "",
    category: 0,
    estimate: 0,
    responsible: 0,
  },
  selectedTask: {
    id: 0,
    task: "",
    description: "",
    criteria: "",
    status: "",
    status_name: "",
    category: 0,
    category_item: "",
    estimate: 0,
    responsible: 0,
    responsible_username: "",
    owner: 0,
    owner_username: "",
    created_at: "",
    updated_at: "",
  },
  users: [
    {
      id: 0,
      username: "",
    },
  ],
  category: [
    {
      id: 0,
      item: "",
    },
  ],
};

export const tasksSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    editTask(state, action: PayloadAction<POST_TASK>) {
      state.editedTask = action.payload;
    },
    slectedTask(state, action: PayloadAction<READ_TASK>) {
      state.selectedTask = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchAsyncGetTasks.fulfilled,
      (state, action: PayloadAction<READ_TASK[]>) => {
        return {
          ...state,
          tasks: action.payload,
        };
      }
    );
    //tokenが切れた場合はlogin画面へ遷移
    builder.addCase(fetchAsyncGetTasks.rejected, () => {
      window.location.href = "/";
    });
    builder.addCase(
      fetchAsyncGetUsers.fulfilled,
      (state, action: PayloadAction<USER[]>) => {
        return {
          ...state,
          users: action.payload,
        };
      }
    );
    builder.addCase(
      fetchAsyncGetCategory.fulfilled,
      (state, action: PayloadAction<CATEGORY[]>) => {
        return {
          ...state,
          category: action.payload,
        };
      }
    );
    builder.addCase(
      fetchAsyncCreateCategory.fulfilled,
      (state, action: PayloadAction<CATEGORY>) => {
        return {
          ...state,
          //categoryの配列を分解して末尾に値を追加
          category: [...state.category, action.payload],
        };
      }
    );
    //tokenが切れた場合はlogin画面へ遷移
    builder.addCase(fetchAsyncCreateCategory.rejected, () => {
      window.location.href = "/";
    });
    builder.addCase(
      fetchAsyncCreateTask.fulfilled,
      (state, action: PayloadAction<READ_TASK>) => {
        return {
          ...state,
          tasks: [action.payload, ...state.tasks],
          editedTask: initialState.editedTask, //入力フォームの初期化
        };
      }
    );
    //tokenが切れた場合はlogin画面へ遷移
    builder.addCase(fetchAsyncCreateTask.rejected, () => {
      window.location.href = "/";
    });
    builder.addCase(
      fetchAsyncUpdateTask.fulfilled,
      (state, action: PayloadAction<READ_TASK>) => {
        return {
          ...state,
          tasks: state.tasks.map((task) =>
            task.id === action.payload.id ? action.payload : task
          ),
          editTask: initialState.editedTask,
          selectedTask: initialState.selectedTask,
        };
      }
    );
    //tokenが切れた場合はlogin画面へ遷移
    builder.addCase(fetchAsyncUpdateTask.rejected, () => {
      window.location.href = "/";
    });
    builder.addCase(
      fetchAsyncDeleteTask.fulfilled,
      (state, action: PayloadAction<number>) => {
        return {
          ...state,
          tasks: state.tasks.filter((t) => t.id !== action.payload),
          editTask: initialState.editedTask,
          selectedTask: initialState.selectedTask,
        };
      }
    );
    //tokenが切れた場合はlogin画面へ遷移
    builder.addCase(fetchAsyncDeleteTask.rejected, () => {
      window.location.href = "/";
    });
  },
});

export const { editTask, slectedTask } = tasksSlice.actions;

export const selectSelectedTask = (state: RootState) => state.task.selectedTask;
export const selectEditedTask = (state: RootState) => state.task.editedTask;
export const selectTasks = (state: RootState) => state.task.tasks;
export const selectUsers = (state: RootState) => state.task.users;
export const selectCategory = (state: RootState) => state.task.category;

export default tasksSlice.reducer;
