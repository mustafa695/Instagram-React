import React, { useEffect, useState } from "react";
import Stories from "react-insta-stories";

const StoryModal = (props) => {
  const [stories, setStories] = useState([]);
  // const stories = [prf1, prf4, prf1, prf4];
  useEffect(() => {
    let arr = [];
    props.otherStories[props.storyInd]?.urls?.map((i) => {
      arr.push(i);
    });
    setStories(arr);
  }, []);
  return (
    <div className="_storyModal">
      <div className="close" onClick={() => props.setShowStoryModal(false)}>
        &#10006;
      </div>
      <div className="viewStory">
        {stories?.length ? (
          <Stories
            stories={stories}
            defaultInterval={1500}
            width={432}
            height={650}
          />
        ) : (
          "Loading..."
        )}
      </div>
    </div>
  );
};

export default StoryModal;
