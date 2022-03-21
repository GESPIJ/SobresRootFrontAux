import React, { useState, useEffect } from "react";
import axios from "axios";
import Orders from "./printersTable";
import BarraNavegacion from "../BarraNavegacion";
import CssBaseline from "@material-ui/core/CssBaseline";

export default function SignUp() {
  //Component States
  const [systems, setSystems] = useState({ systems: [], selectedSystem: "" });

  //Component Functions

  //Function for fetching all the printers in the DB
  const fetchPrinters = async () => {
    //Server Response
    const response = await axios.get("/admin/printersAll");
    //Update State
    setSystems({ ...systems, systems: response.data.printers.reverse() });
  };

  //Evertime the component is mounted we made a request for all the printers in the system
  useEffect(() => {
    const callFetchPrinters = async () => {
      await fetchPrinters();
    };
    const response = callFetchPrinters();
  }, []);

  return (
    <div className="signup">
      <BarraNavegacion />
      <CssBaseline />
      <Orders solitudes={systems.systems} />
    </div>
  );
}
