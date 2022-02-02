import React from "react";
import Header from "../Header";
import "./Style.scss"

const NotFound = () => {
  return (
    <>
      <Header />
      <div className="notFound" style={{marginTop:'7rem'}}>
        <h3>Sorry, this page isn't available.</h3>
        <p>The link you followed may be broken, or the page may have been removed.</p>
      </div>
    </>
  );
};

export default NotFound;
