import React from "react";
import Skeleton from "react-loading-skeleton";

const Suggestion = () => {
  return (
   
      <div className="d-flex justify-content-between ">
        <div className="d-flex">
          <div className="avatar">
            <Skeleton circle={true} className="avatar" />
          </div>
          <div className="ps-3">
            <div className="username">
              <Skeleton count={2} />
            </div>
            <h6 className="sgfy" style={{ opacity: "0" }}>
              Suggested for you
            </h6>
          </div>
        </div>
        <a className="mt-2" style={{ width: "40px" }}>
          <Skeleton />
        </a>
      </div>
   
  );
};

export default Suggestion;
