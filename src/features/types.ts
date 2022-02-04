/*authSlice*/

import TaskList from "./task/TaskList";

export interface LOGIN_USER {
  id: number;
  username: string;
}

//ファイルよう
export interface FILE extends Blob {
  readonly lastModified: number;
  readonly name: string;
}

//get
export interface PROFILE {
  id: number;
  user_profile: number;
  img: string | null; //urlのpath
}

//post
export interface POST_PROFILE {
  id: number;
  img: FILE | null;
}

export interface CRED {
  username: string;
  password: string;
}

export interface JWT {
  refresh: string;
  access: string;
}

//ユーザー一覧
export interface USER {
  id: number;
  username: string;
}

//認証状態管理
export interface AUTH_STATE {
  isLoginView: boolean;
  loginUser: LOGIN_USER;
  profiles: PROFILE[];
}

/*taskSlice*/

//getで取得
export interface READ_TASK {
  id: number;
  task: string;
  description: string;
  criteria: string;
  status: string;
  status_name: string;
  category: number;
  category_item: string;
  estimate: number;
  responsible: number;
  responsible_username: string;
  owner: number;
  owner_username: string;
  created_at: string;
  updated_at: string;
}

//post
export interface POST_TASK {
  id: number;
  task: string;
  description: string;
  criteria: string;
  status: string;
  category: number;
  estimate: number;
  responsible: number;
}

export interface CATEGORY {
  id: number;
  item: string;
}

//react側で管理するstate
export interface TASK_STATE {
  tasks: READ_TASK[];
  editedTask: POST_TASK;
  selectedTask: READ_TASK;
  users: USER[];
  category: CATEGORY[];
}

/*TaskList*/
export interface SORT_STATE {
  rows: READ_TASK[]; //ソートするタスクの一覧
  order: "desc" | "asc"; //昇順高順
  activeKey: string; //どのカラムがソートのアクティブなのかを判定
}
