import React, { useState, useEffect } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import axios from "axios";
import Orders from "./usersTable";
import { Backdrop, CircularProgress } from "@material-ui/core";
//Internal Components
import BarraNavegacion from "../BarraNavegacion";

export default function SignUp() {
  //Component States
  const [systems, setSystems] = useState({ systems: [], selectedSystem: "" });
  const [loading, setloading] = useState(true);

  //Function for fetching all the users in the system
  const fetchSystems = async () => {
    //Server Response
    const response = await axios.get("/admin/usersAll");

    const usersWithoutAdmin = response.data.systems.filter(
      (user) => user.nm !== "NM0"
    );

    //We update the data
    setSystems({ ...systems, systems: usersWithoutAdmin.reverse() });
    //We cancel the spinner
    setloading(false);
  };

  //We fetch all the users once the component is mounted
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
          <Orders solitudes={systems.systems} fetchSolitudes={fetchSystems} />
        </div>
      )}
    </div>
  );
}
