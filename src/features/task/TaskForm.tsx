import React, { useState } from "react";
import {
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Button,
  Fab,
  Modal,
  Box,
  SelectChangeEvent,
} from "@mui/material";

import { Save, Add } from "@mui/icons-material";

import { useSelector, useDispatch } from "react-redux";
import {
  fetchAsyncCreateTask,
  fetchAsyncUpdateTask,
  fetchAsyncCreateCategory,
  selectUsers,
  selectEditedTask,
  selectCategory,
  editTask,
  selectTask,
} from "./taskSlice";

import { AppDispatch } from "../../app/store";
import { initialState } from "./taskSlice";
import { userInfo } from "os";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "none",
  boxShadow: 24,
  p: 4,
};

const TaskForm: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const users = useSelector(selectUsers);
  const category = useSelector(selectCategory);
  const editedTask = useSelector(selectEditedTask);
  const [inputText, setInputText] = useState("");
  /*モーダル管理 */
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  /*モーダル管理*/

  /* inputButtonnのディセーブル管理*/
  const isDisabled =
    editedTask.task.length === 0 ||
    editedTask.description.length === 0 ||
    editedTask.criteria.length === 0;
  const isCatDisabled = inputText.length === 0;
  /* inputButtonnのディセーブル管理*/

  /*入力フォームの受け取り。*/
  //category作成用
  const handleInputTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };
  //estimateはnumberなのでestimateのデータ型をnumberに変更している。
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value: string | number = e.target.value;
    const name = e.target.name;
    if (name === "estimate") {
      value = Number(value);
    }
    dispatch(editTask({ ...editedTask, [name]: value }));
  };
  /*入力フォームの受け取り。*/

  /*selectフォーム*/

  /*selectフォームに変化があったときに呼ばれる。*/
  //responsibleセレクター
  const handleSelectRespChange = (e: SelectChangeEvent<number>) => {
    const value: number = e.target.value as number;
    dispatch(editTask({ ...editedTask, responsible: value }));
  };

  //statusセレクター
  const handleSelectStatusChange = (e: SelectChangeEvent<string>) => {
    //セレクトの場合、型づけができないので一旦unknownにしている。
    const value: string = e.target.value as string; //値を受け取ったときにnumber型にしている。
    dispatch(editTask({ ...editedTask, status: value }));
  };
  //categoryセレクターSelectChangeEvent<number>, child: React.ReactNode
  const handleSelectCatChange = (e: SelectChangeEvent<number>) => {
    //セレクトの場合、型づけができないので一旦unknownにしている。
    const value: number = e.target.value as number; //値を受け取ったときにnumber型にしている。
    dispatch(editTask({ ...editedTask, category: value }));
  };

  //user一覧を取得
  let userOptions = users.map((user) => (
    <MenuItem key={user.id} value={user.id}>
      {user.username}
    </MenuItem>
  ));

  let catOptions = category.map((cat) => (
    <MenuItem key={cat.id} value={cat.id}>
      {cat.item}
    </MenuItem>
  ));
  console.log(catOptions);
  /*selectフォーム*/

  return (
    <div>
      <h2>{editedTask.id ? "Update Task" : "New Task"}</h2>
      <form>
        <TextField
          sx={{ m: 2, minWidth: 240 }}
          label="Estimate [days]"
          type="number"
          name="estimate"
          InputProps={{ inputProps: { min: 0, max: 1000 } }}
          InputLabelProps={{ shrink: true }}
          value={editedTask.estimate}
          onChange={handleInputChange}
        />

        <TextField
          sx={{ m: 2, minWidth: 240 }}
          label="Task"
          type="text"
          name="task"
          InputLabelProps={{ shrink: true }}
          value={editedTask.task}
          onChange={handleInputChange}
        />
        <TextField
          sx={{ m: 2, minWidth: 240 }}
          label="Description"
          type="text"
          name="description"
          InputLabelProps={{ shrink: true }}
          value={editedTask.description}
          onChange={handleInputChange}
        />

        <TextField
          sx={{ m: 2, minWidth: 240 }}
          label="Criteria"
          InputLabelProps={{ shrink: true }}
          type="text"
          name="criteria"
          value={editedTask.criteria}
          onChange={handleInputChange}
        />
        <br />
        <FormControl sx={{ m: 2, minWidth: 240 }}>
          <InputLabel>Responsible</InputLabel>
          <Select
            name="responsible"
            onChange={handleSelectRespChange}
            value={editedTask.responsible}
          >
            {userOptions}
          </Select>
        </FormControl>
        <FormControl sx={{ m: 2, minWidth: 240 }}>
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={editedTask.status}
            onChange={handleSelectStatusChange}
          >
            <MenuItem value={1}>Not started</MenuItem>
            <MenuItem value={2}>On going</MenuItem>
            <MenuItem value={3}>Done</MenuItem>
          </Select>
        </FormControl>
        <br />
        <FormControl sx={{ m: 2, minWidth: 240 }}>
          <InputLabel>Category</InputLabel>
          <Select
            name="category"
            value={editedTask.category}
            onChange={handleSelectCatChange}
          >
            {catOptions}
          </Select>
        </FormControl>
        <Fab
          size="small"
          color="primary"
          sx={{ mt: 2, ml: 3 }}
          onClick={handleOpen}
        >
          <Add />
        </Fab>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <TextField
              InputLabelProps={{
                shrink: true,
              }}
              label="New category"
              type="text"
              value={inputText}
              onChange={handleInputTextChange}
            />
            <Button
              sx={{ m: 3 }}
              variant="contained"
              color="primary"
              size="small"
              startIcon={<Save />}
              disabled={isCatDisabled}
              onClick={() => {
                dispatch(fetchAsyncCreateCategory(inputText));
                handleClose();
              }}
            >
              SAVE
            </Button>
          </Box>
        </Modal>
        <br />
        <Button
          sx={{ m: 3 }}
          variant="contained"
          color="primary"
          size="small"
          startIcon={<Save />}
          disabled={isDisabled}
          onClick={
            editedTask.id !== 0
              ? () => dispatch(fetchAsyncUpdateTask(editedTask))
              : () => dispatch(fetchAsyncCreateTask(editedTask))
          }
        >
          {editedTask.id !== 0 ? "Update" : "Save"}
        </Button>

        <Button
          variant="contained"
          size="small"
          onClick={() => {
            dispatch(editTask(initialState.editedTask));
            dispatch(selectTask(initialState.selectedTask));
          }}
        >
          Cancel
        </Button>
      </form>
    </div>
  );
};
export default TaskForm;
