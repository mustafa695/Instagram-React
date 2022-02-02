import React from "react";
import Skeleton from "react-loading-skeleton";
import "./style.scss";
const StoryLoader = () => {
  return (
    <div className="storyLoader">
      <Skeleton style={{height:'50px'}}/>
    </div>
  );
};

export default StoryLoader;
