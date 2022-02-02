import React, { useEffect, useState } from "react";
import Stories from "react-insta-stories";
import prf1 from "../../assets/images/prf-1.jpg";
import prf4 from "../../assets/images/prf-4.jpg";

const UserStoryModal = (props) => {
  const [stories, setStories] = useState([]);
  useEffect(() => {
    let arr = [];
    props?.userStories?.map((i) => {
      if (i.urls.length) {
        i.urls.map((u) => {
          arr.push(u);
        });
        setStories(arr);
      }
    });
  }, []);
  return (
    <div className="_storyModal">
      <div className="close" onClick={() => props.setShowUserStoryModal(false)}>
        &#10006;
      </div>
      <div className="viewStory">
        {stories.length ? (
          <Stories
            stories={stories}
            defaultInterval={1500}
            width={400}
            height={650}
          />
        ) : (
          "Loading...."
        )}
        <div className="crtmore">
          <input type="file" onChange={props.storyImageUpload} />
          <span>+</span>
        </div>
      </div>
    </div>
  );
};

export default UserStoryModal;
