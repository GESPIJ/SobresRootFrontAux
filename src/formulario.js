import React, { useState, useEffect } from "react";
import Material from "@material-ui/core";
import Button from "@material-ui/core/Button";
import "./formulario.css";
import { Link } from "react-router-dom";
function Formulario({ cambiarUsuarioActual, usuarioActual }) {
  const [usuario, setusuario] = useState("");
  const [contraseña, setcontraseña] = useState("");

  return (
    <>
      <div class="contenedor">
        <h1>Login Normal</h1>
        <Button variant="contained">Default</Button>
        <form action="">
          <input
            type="text"
            onChange={(e) => {
              setusuario(e.target.value);
              cambiarUsuarioActual(e.target.value);
            }}
            value={usuario}
            placeholder="Usuario"
          />
          <br />
          <br />
          {/* <input type="text" placeholder="Lastname" />
          <br />
          <br /> */}
          {/* <input type="email" placeholder="Email" />
          <br />
          <br /> */}
          {/* <input type="number" placeholder="Cell phone" />
          <br />
          <br /> */}
          <input
            type="password"
            onChange={(e) => {
              setcontraseña(e.target.value);
            }}
            value={contraseña}
            placeholder="Password"
          />
          <br />
          <br />
          {/* <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              console.log("Haciendo submit");
            }}
            class="boton">
            
          </button> */}
          <Link className="boton" to="/loginLDAP">
            Registrar
          </Link>
        </form>
      </div>
    </>
  );
}

export default Formulario;
