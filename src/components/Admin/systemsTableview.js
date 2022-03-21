import React, { useState, useEffect } from "react";
import axios from "axios";
import Orders from "./systemsTable";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Backdrop, CircularProgress } from "@material-ui/core";
//Internal components and functions
import BarraNavegacion from "../BarraNavegacion";

export default function SignUp() {
  //Component States
  const [systems, setSystems] = useState({ systems: [], selectedSystem: "" });
  const [loading, setloading] = useState(true);

  //Function for fetching all the systems from the DB
  const fetchSystems = async () => {
    //Server Response
    const response = await axios.get("/admin/systemsAll");
    setSystems({ ...systems, systems: response.data.systems.reverse() });
    //We cancel the loader spinner
    setloading(false);
  };

  useEffect(() => {
    fetchSystems();
    return () => {};
  }, []);

  return (
    <div className="signup">
      <BarraNavegacion />

      <Backdrop open={loading}>
        <CircularProgress />
      </Backdrop>

      {!loading && (
        <div>
          <CssBaseline />
          <Orders solitudes={systems.systems} fetchSystems={fetchSystems} />
        </div>
      )}
    </div>
  );
}
