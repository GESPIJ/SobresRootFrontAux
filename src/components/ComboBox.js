/* eslint-disable no-use-before-define */
import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

export default function ComboBox({ label, elements, value, setadmin, system }) {
  const options = elements ? options : admins;
  return (
    <Autocomplete
      onChange={(e) => {
        // console.log("Este es el nuevo sistema seleccionado");
        // console.log(e.target.value);
        let administrador = e.target.innerText;
        setadmin({ ...system, admin: administrador });
        //debugger;
      }}
      id="combo-box-demo"
      options={options}
      getOptionLabel={(option) => option.title}
      style={{ width: "100%" }}
      renderInput={(params) => (
        <TextField {...params} label={label} variant="outlined" />
      )}
    />
  );
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const admins = [
  { title: "Oswaldo", year: 1994 },
  { title: "Vladimir", year: 1972 },
];
