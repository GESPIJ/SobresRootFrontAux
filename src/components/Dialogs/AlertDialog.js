import React, { useState, useEffect, useRef, useContext } from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";

const useStylesForm = makeStyles((theme) => ({
  root: {
    // backgroundColor: "rgb(49, 61, 70)",
    //backgroundColor: "rgb(30,33,35)",
    "& .MuiDialogTitle-root": {
      color: "black",
      width: 200,
    },
    "& label.Mui-focused": {
      color: "black",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "black",
    },
    "& .MuiInputLabel-formControl": {
      color: "black",
    },
    "& .MuiInputBase-input": {
      color: "black",
    },
    "& .MuiDialog-paperWidthSm": {
      maxWidth: "400px",
    },
    "& .MuiDialog-paper": {
      margin: "32px",
      position: "relative",
      overflowY: "auto",
      width: "300px",
      maxWidth: "300px",
    },
  },

  confirmButton: {
    backgroundColor: "#6c757d",
    color: "#ced4da",
  },

  cancelButton: {
    backgroundColor: "#001f3f",
    color: "#ced4da",
  },

  container1: {
    width: 150,
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  textField2: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 120,
  },
  dialogTitle: {
    //backgroundColor: "rgb(49, 61, 70)",
    //backgroundColor: "rgb(30,33,35)",
    color: "black",
  },

  textFieldForm: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
    width: "70%",
    color: "rgb(0,0,0)",
  },
  textFieldForm2: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
    width: 200,
    color: "rgb(0,0,0)",
  },
  button: {
    color: "white",
    backgroundColor: "#343484",
  },
}));

function AlerttDialog({ title, cancelFunction, confirmFunction }) {
  const handleConfirm = () => {
    confirmFunction(false);
  };

  const handleCancel = () => {
    cancelFunction(false);
  };

  const classesFormDialog = useStylesForm();

  return (
    <div>
      <Dialog
        maxWidth="sm"
        open={true}
        onClose={handleCancel}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle
          //className={classesFormDialog.dialogTitle}
          id="form-dialog-title"
        >
          {title}
        </DialogTitle>

        <DialogActions className={classesFormDialog.root}>
          <Button
            //className={classesFormDialog.cancelButton}
            onClick={handleConfirm}
            color="primary"
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AlerttDialog;
