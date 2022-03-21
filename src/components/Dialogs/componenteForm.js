import React, { useState, useEffect, useContext } from "react";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
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

import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
// import { ContextMenu } from "react-contextmenu";
// import MyContext from "../context/context";

import { makeStyles } from "@material-ui/core/styles";
// import { rgb } from "chroma-js";

const useStylesTime = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },

  textFieldForm: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
    width: "70%",
    color: "white",
  },
}));

const useStylesForm = makeStyles((theme) => ({
  root: {
    backgroundColor: "rgb(49, 61, 70)",
    "& .MuiDialogTitle-root": {
      color: "white",
    },
    "& label.Mui-focused": {
      color: "white",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "white",
    },
    "& .MuiInputLabel-formControl": {
      color: "white",
    },
    "& .MuiInputBase-input": {
      color: "white",
    },
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
    backgroundColor: "rgb(49, 61, 70)",
    color: "white",
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

function TimePickers() {
  const classesTime = useStylesTime();

  return (
    <form className={classesTime.container} noValidate>
      <TextField
        id="time"
        label="Time"
        type="time"
        defaultValue="07:30"
        className={classesTime.textFieldForm}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          step: 300, // 5 min
        }}
      />
    </form>
  );
}

function DatePickers() {
  const classes = useStylesTime();

  return (
    <form className={classes.container} noValidate>
      <TextField
        id="date"
        label="Date"
        type="date"
        defaultValue="2017-05-24"
        className={classes.textFieldForm}
        InputLabelProps={{
          shrink: true,
        }}
      />
    </form>
  );
}

function FormDialog({ title, displayFunction }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    displayFunction(true);
  };

  const handleClose = () => {
    displayFunction(false);
  };

  const classesFormDialog = useStylesForm();

  return (
    <div>
      <Dialog
        width={400}
        open={true}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle
          className={classesFormDialog.dialogTitle}
          id="form-dialog-title"
        >
          {title}
        </DialogTitle>
        <DialogContent className={classesFormDialog.root}>
          {/* <DialogContentText>Select an option below</DialogContentText> */}
          <TextField
            className={classesFormDialog.textFieldForm}
            autoFocus
            margin="dense"
            // id="name"
            label="User"
            type="email"
            fullWidth
          />

          <TextField
            className={classesFormDialog.textFieldForm}
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
          />

          <TimePickers />

          <DatePickers />
        </DialogContent>
        <DialogActions className={classesFormDialog.root}>
          <Button
            className={classesFormDialog.button}
            onClick={handleClose}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            className={classesFormDialog.button}
            onClick={handleClose}
            color="primary"
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function FormDialogAuth({ title, displayFunction }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    displayFunction(true);
  };

  const handleClose = () => {
    displayFunction(false);
  };

  const classesFormDialog = useStylesForm();

  return (
    <div>
      <Dialog
        open={true}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle
          className={classesFormDialog.dialogTitle}
          id="form-dialog-title"
        >
          {title}
        </DialogTitle>
        <DialogContent className={classesFormDialog.root}>
          {/* <DialogContentText>Select an option below</DialogContentText> */}
          <TextField
            className={classesFormDialog.textFieldForm}
            autoFocus
            margin="dense"
            // id="name"
            label="User"
            type="email"
          />

          <TextField
            className={classesFormDialog.textFieldForm}
            autoFocus
            margin="dense"
            id="name"
            label="Password"
            type="password"
          />
        </DialogContent>
        <DialogActions className={classesFormDialog.root}>
          <Button
            className={classesFormDialog.button}
            onClick={handleClose}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            className={classesFormDialog.button}
            onClick={handleClose}
            color="primary"
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function FormDialogShelve({ title, displayFunction }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    displayFunction(true);
  };

  const handleClose = () => {
    displayFunction(false);
  };

  const classesFormDialog = useStylesForm();

  return (
    <div>
      <Dialog
        open={true}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle
          className={classesFormDialog.dialogTitle}
          id="form-dialog-title"
        >
          {title}
        </DialogTitle>
        <DialogContent className={classesFormDialog.root}>
          {/* <DialogContentText>Select an option below</DialogContentText> */}
          <TextField
            className={classesFormDialog.textFieldForm}
            autoFocus
            margin="dense"
            // id="name"
            label="Weeks"
            type="number"
          />

          <TextField
            className={classesFormDialog.textFieldForm}
            autoFocus
            margin="dense"
            id="name"
            label="Days"
            type="number"
          />
          <TextField
            className={classesFormDialog.textFieldForm}
            autoFocus
            margin="dense"
            id="name"
            label="Hours"
            type="number"
          />
          <TextField
            className={classesFormDialog.textFieldForm}
            autoFocus
            margin="dense"
            id="name"
            label="Minutes"
            type="number"
          />
          <TextField
            className={classesFormDialog.textFieldForm}
            autoFocus
            margin="dense"
            id="name"
            label="Seconds"
            type="number"
          />
        </DialogContent>
        <DialogActions className={classesFormDialog.root}>
          <Button
            className={classesFormDialog.button}
            onClick={handleClose}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            className={classesFormDialog.button}
            onClick={handleClose}
            color="primary"
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function RadioButtonsGroup({ title, options }) {
  const [value, setValue] = React.useState("female");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend" color="grey">
        {title}
      </FormLabel>
      <RadioGroup
        aria-label="gender"
        name="gender1"
        value={value}
        onChange={handleChange}
      >
        {options.map((option) => {
          return (
            <FormControlLabel
              value={option}
              control={<Radio />}
              label={option}
            />
          );
        })}
      </RadioGroup>
    </FormControl>
  );
}

const miComponente = () => {
  return <FormDialogAuth title="Shelve Alarm" />;
};

export default miComponente;
