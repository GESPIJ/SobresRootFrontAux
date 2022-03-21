import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
// import { Link, Grid, Backdrop, CircularProgress } from "@material-ui/core";
import Orders from "./solitudesTable";
import MyContext from "../../context/mycontext";
import BarraNavegacion from "../BarraNavegacion";
import OtraSolitudesTable from "./otraTabaSolitudes";
import CssBaseline from "@material-ui/core/CssBaseline";

export default function SignUp() {
  const ctx = useContext(MyContext);
  const history = useHistory();

  //Component States
  const [systems, setSystems] = useState({ systems: [], selectedSystem: "" });
  const [loading, setloading] = useState(true);

  const fetchSystems = async () => {
    const payload = { nm: ctx.nmActual };

    //Server Response
    const response = await axios.post("/operation/solitudesAll", payload);

    //We update the data
    setSystems({ ...systems, systems: response.data.systems });
    setTimeout(() => {
      setloading(false);
    }, 1500);
  };

  //We fetch all the solitudes once the component is mounted
  useEffect(() => {
    fetchSystems();
    return () => {};
  }, []);

  //JSX Component
  return (
    <div className="signup">
      <BarraNavegacion />

      <CssBaseline />
      {/* <OtraSolitudesTable solitudes={systems.systems} /> */}
      <Orders solitudes={systems.systems} />
    </div>
  );
}
