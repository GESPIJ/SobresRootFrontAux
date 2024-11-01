import React, { useContext } from "react";
import Title from "./Title";
import { GeneralContext } from "../context/mycontext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const ctx = useContext(GeneralContext);
  for (let role of allowedRoles) {
    if (ctx.userAditionalInfo.department?.includes(role)) {
      return <>{children}</>;
    }
  }

  return <Title style={{ marginTop: "2rem" }}>No estas autorizado</Title>;
}
