import React, { useState, useEffect } from "react";
import styles from "./TaskList.module.css";
import {
  DeleteOutlineOutlined,
  EditOffOutlined,
  AddCircleOutline,
  Sort,
  NetworkLockedRounded,
} from "@mui/icons-material";

import {
  Button,
  Avatar,
  Badge,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  TableSortLabel,
} from "@mui/material";

import { useSelector, useDispatch } from "react-redux";
import { selectLoginUser, selectProfiles } from "../auth/authSlice";
import {
  fetchAsyncDeleteTask,
  selectSelectedTask,
  editTask,
  selectTasks,
  selectTask,
} from "./taskSlice";

import { AppDispatch } from "../../app/store";
import { initialState } from "./taskSlice";
import { SORT_STATE, READ_TASK } from "../types";

const TaskList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const tasks = useSelector(selectTasks);
  const loginUser = useSelector(selectLoginUser);
  const profiles = useSelector(selectProfiles);

  /*
  カラムの情報をmapで展開するための配列を作成
  https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
  */
  const colums = tasks[0] && Object.keys(tasks[0]);

  //ソートのstate
  const [state, setState] = useState<SORT_STATE>({
    rows: tasks,
    order: "desc",
    activeKey: "",
  });

  //keyofでREAD_TASKのいずれかをkeyを受け取る指示をしている。
  const handleClickSortColumn = (column: keyof READ_TASK) => {
    const isDesc = column === state.activeKey && state.order === "desc"; //descがtrueかfulseかを判定
    const newOrder = isDesc ? "asc" : "desc"; //isDescのboolean値に応じて値をセット

    /*
    1. Array.from(state.rows): 引数で渡された配列をコピーする。
    2. sort((a, b)):1でコピーされた行を隣り合う行ごとに評価するために引数a, bを渡している。
    3. sortは評価された値が1の場合は値を反転させる機能がある。
    4. https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
    */
    const sorteRows = Array.from(state.rows).sort((a, b) => {
      if (a[column] > b[column]) {
        //左辺がtrueだった場合 1,1とはif (その順序の基準において a が b より大)この条件に応じてsort関数として昇順か高順を判定している。
        return newOrder === "asc" ? 1 : -1;
      } else if (a[column] < b[column]) {
        return newOrder === "asc" ? -1 : 1;
      } else {
        return 0;
      }
    });
    setState({
      rows: sorteRows,
      order: newOrder,
      activeKey: column,
    });
  };
  //配列tasksに変化があったときにtasksの情報を上書きする。
  useEffect(() => {
    setState((state) => ({ ...state, rows: tasks }));
  }, [tasks]);

  //statusの色変更の関数
  const renderSwitch = (statusName: string) => {
    switch (statusName) {
      case "Not started":
        return (
          <Badge variant="dot" color="error">
            {statusName}
          </Badge>
        );
      case "On going":
        return (
          <Badge variant="dot" color="primary">
            {statusName}
          </Badge>
        );
      case "Done":
        return (
          <Badge variant="dot" color="secondary">
            {statusName}
          </Badge>
        );
      default:
        return null;
    }
  };

  //taskリスト内でのアバター画像の取得関数
  //該当ユーザーの配列を取得しimage画像をreturn
  const conditionalSrc = (user: number) => {
    const loginProfile = profiles.filter(
      (prof) => prof.user_profile === user
    )[0];
    return loginProfile?.img !== null ? loginProfile?.img : undefined;
  };
  return (
    <>
      <Button
        sx={{ m: 3 }}
        variant="contained"
        color="primary"
        size="small"
        startIcon={<AddCircleOutline />}
        onClick={() => {
          dispatch(
            editTask({
              id: 0,
              task: "",
              description: "",
              criteria: "",
              responsible: loginUser.id,
              status: "1",
              category: 1,
              estimate: 0,
            })
          );
          dispatch(selectTask(initialState.selectedTask));
        }}
      >
        Add New
      </Button>
      {tasks[0]?.task && (
        <Table size="small">
          <TableHead>
            <TableRow>
              {colums.map(
                (colum, colIndex) =>
                  //表示させたいcolumがtureの場合&&右辺を実行
                  (colum === "task" ||
                    colum === "status" ||
                    colum === "category" ||
                    colum === "estimate" ||
                    colum === "responsible" ||
                    colum === "owner") && (
                    <TableCell align="center" key={colIndex}>
                      <TableSortLabel
                        active={state.activeKey === colum}
                        direction={state.order}
                        onClick={() => handleClickSortColumn(colum)}
                      >
                        <strong>{colum}</strong>
                      </TableSortLabel>
                    </TableCell>
                  )
              )}
              {/* 空のセルを挿入 */}
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {state.rows.map((row, rowIndex) => (
              <TableRow hover key={rowIndex}>
                {Object.keys(row).map(
                  (key, colIndex) =>
                    (key === "task" ||
                      key === "status_name" ||
                      key === "category_item" ||
                      key === "estimate") && (
                      <TableCell
                        align="center"
                        className={styles.tasklist__hover}
                        key={`${rowIndex}+${colIndex}`}
                        onClick={() => {
                          dispatch(selectTask(row));
                          dispatch(editTask(initialState.editedTask));
                        }}
                      >
                        {key === "status_name" ? (
                          renderSwitch(row[key])
                        ) : (
                          <span>{row[key]}</span>
                        )}
                      </TableCell>
                    )
                )}
                <TableCell>
                  <Avatar alt="resp" src={conditionalSrc(row["responsible"])} />
                </TableCell>
                <TableCell>
                  <Avatar alt="resp" src={conditionalSrc(row["owner"])} />
                </TableCell>
                <TableCell align="center">
                  <button
                    className={styles.tasklist__icon}
                    onClick={() => {
                      dispatch(fetchAsyncDeleteTask(row.id));
                    }}
                    disabled={row["owner"] !== loginUser.id}
                  >
                    <DeleteOutlineOutlined />
                  </button>

                  <button
                    className={styles.tasklist__icon}
                    onClick={() => dispatch(editTask(row))}
                    disabled={row["owner"] !== loginUser.id}
                  >
                    <EditOffOutlined />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
};

export default TaskList;
