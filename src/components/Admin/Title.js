import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import CssBaseline from "@material-ui/core/CssBaseline";

export default function Title(props) {
  return (
    <div>
      <CssBaseline />
      <Typography
        component="h2"
        variant="h6"
        //color="primary"
        gutterBottom
      >
        {props.children}
      </Typography>
    </div>
  );
}

Title.propTypes = {
  children: PropTypes.node,
};
