import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Orders from "./systemsTable";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Backdrop, CircularProgress } from "@material-ui/core";
//Internal components and functions
import BarraNavegacion from "../BarraNavegacion";
import MyContext from "../../context/mycontext";

export default function SignUp() {
  const ctx = useContext(MyContext);

  //Component States
  const [systems, setSystems] = useState({ systems: [], selectedSystem: "" });
  const [loading, setloading] = useState(true);

  //Function for fetching all the systems from the DB
  const fetchSystems = async () => {
    console.log(ctx);
    //Server Response
    //const response = await axios.get("/admin/systemsAll");
    //console.log(response);
    debugger;
    let response;
    if (ctx.userAditionalInfo.department == "Administración") {
      response = await axios.post("/admin/getSystemByNMSecurity", {
        id: ctx.userAditionalInfo.id,
      });
    } else {
      response = await axios.post("/admin/getSystemByNMTecnologie", {
        id: ctx.userAditionalInfo.id,
      });
    }
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
