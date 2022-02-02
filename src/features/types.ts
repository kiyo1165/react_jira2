/*authSlice*/

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

export interface CRED  {
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
    profiles: PROFILE[]
}



