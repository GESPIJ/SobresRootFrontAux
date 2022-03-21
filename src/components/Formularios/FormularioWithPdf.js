import { requirePropFactory } from "@material-ui/core";
import React, { useState } from "react";
//import { Document, Page } from "react-pdf";

export default function FuncionParaMostrarPDF() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  //function onDocumentLoadSuccess({ numPages }) {
  //  setNumPages(numPages);
  //}

  return (
    <div>
      {/* <Document file="donquijote.pdf" onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} />
      </Document> */}

      <object
        data={"./Greg.pdf"}
        type="application/pdf"
        width="100%"
        height="100%"
      >
        <iframe src={"./Greg.pdf"} type="application/pdf" />
      </object>
      {/* <p>
        Page {pageNumber} of {numPages}
      </p> */}
    </div>
  );
}
