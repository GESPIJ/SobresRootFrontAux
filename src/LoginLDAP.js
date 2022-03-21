import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, withRouter } from "react-router-dom";
import MyContext from "./context/mycontext";

function LoginLDAP({ usuarioActual, cambiarUsuarioActual, history }) {
  const [usuario, setusuario] = useState(usuarioActual ? usuarioActual : "");
  const [contraseña, setcontraseña] = useState("");
  const ctx = useContext(MyContext);
  useEffect(() => {
    console.log(history);
  }, [history]);
  return (
    <>
      <img src="/BancoVenezuela.jpg" alt="" height="120px" width="240px" />
      <div className="contenedor">
        <h1>Login LDAP</h1>
        <form action="">
          <input
            type="text"
            onChange={(e) => {
              setusuario(e.target.value);
              cambiarUsuarioActual(e.target.value);
            }}
            value={ctx.usuarioActual}
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
          {
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                history.goBack();
                console.log("Haciendo submit");
              }}
              className="boton"></button>
          }
          {/* <Link className="boton" to="/">
            Registrar
          </Link> */}
        </form>
      </div>
    </>
  );
}

export default withRouter(LoginLDAP);
