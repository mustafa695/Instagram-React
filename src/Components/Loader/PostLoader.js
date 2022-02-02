import React from "react";
import Skeleton from "react-loading-skeleton";
import "./style.scss";
const PostLoader = () => {
  return (
    <div className="feeds">
      <div className="fd_headLoader">
        <div style={{ width: "95%" }}>
          <Skeleton className="headLoader" count={1} />
        </div>
      </div>

      <div className="fd_wall">
        <Skeleton className="fd_wallLoader" />
      </div>
      <div className="mx-2 mt-3 mb-3">
          <Skeleton count={1} className="fd_actionLoader"/>
      </div>
      <div className="ms-3">
          <Skeleton count={3} style={{width:'30%'}}/>
      </div>
      <div className="comment_sec">
          <Skeleton style={{height:'30px'}}/>
      </div>
    </div>
  );
};

export default PostLoader;
