import React from "react";
import Button from "@material-ui/core/Button";
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
      color: "white",
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
    //backgroundColor: "#3f51b5",
    color: "#ced4da",
  },

  textJustified: {
    textAlign: "justify",
  },

  cancelButton: {
    //backgroundColor: "#001f3f",
    //backgroundColor: "#3f51b5",
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
    // backgroundColor: "rgb(30,33,35)",
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

function FormDialogAuth({
  title,
  contentText,
  cancelFunction,
  confirmFunction,
  formData,
  setformData,
}) {
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState(false);

  const handleConfirm = () => {
    confirmFunction();
  };

  const handleCancel = () => {
    cancelFunction();
  };

  const handleBlur = () => {
    if (formData.newPassword !== formData.newPasswordConfirmation) {
      setError(true);
    } else {
      setError(false);
    }
  };

  const classesFormDialog = useStylesForm();

  return (
    <div>
      <Dialog
        maxWidth="xs"
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
        <DialogContent
        //className={classesFormDialog.root}
        >
          <DialogContentText
            id="alert-dialog-description"
            className={classesFormDialog.textJustified}
          >
            {contentText}
          </DialogContentText>
          {/* <DialogContentText>Select an option below</DialogContentText> */}
        </DialogContent>
        <DialogActions>
          <Button
            //className={classesFormDialog.confirmButton}
            onClick={handleCancel}
            color="primary"
          >
            Cancelar
          </Button>
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

export default FormDialogAuth;
