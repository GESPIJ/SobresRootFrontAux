import React, { useContext } from "react";

import MyContext from "../context/mycontext";
import { Typography } from "@material-ui/core";

export default function ProtectedRoute({ children, allowedRoles }) {
  const ctx = useContext(MyContext);
  for (let role of allowedRoles) {
    if (ctx.userAditionalInfo.department?.includes(role)) {
      return <>{children}</>;
    }
  }

  return (
    <Typography style={{ marginTop: "2rem" }}>No estas autorizado</Typography>
  );
}
