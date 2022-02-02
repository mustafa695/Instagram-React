import React, { useEffect, useState } from "react";
import { db } from "../config/firebase";
import Skeleton from "react-loading-skeleton";
import { useSelector } from "react-redux";
import Suggestion from "./Loader/Suggestion";

const SideHome = () => {
  const userData = useSelector((state) => state.userData);
  const [followUsers, setFollowUsers] = useState([]);
  const [isFollow, setIsFollow] = useState([]);
  const getFollowCollections = () => {
    db.collection("follow")
      .get()
      .then((res) => {
        let data = res.docs.map((i) => {
          return { ...i.data(), id: i.id };
        });
        setIsFollow(data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getFollowCollections();
    db.collection("users")
      .limit(3)
      .orderBy("createAt", "desc")
      .get()
      .then((res) => {
        let data = res.docs.map((i) => i.data());
        let filters = data.filter((u) => u.uid !== userData.uid);
        setFollowUsers(filters);
      })
      .catch((err) => console.log(err));
  }, []);

  const followUser = (id) => {
    let input = {
      fuid: id,
      uid: userData.uid,
    };
    db.collection("follow")
      .add(input)
      .then((res) => {
        getFollowCollections();
      })
      .catch((err) => console.log(err));
  };

  const unfollowUser = (id) => {
    db.collection("follow")
      .doc(id)
      .delete()
      .then((re) => {
        getFollowCollections();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="__sidebar">
      <div className="head">
        <div className="profile">
          <img
            src={userData?.avatar}
            alt={userData?.avatar}
            className="avatar"
          />
          <div className="ps-3">
            <h5 className="username">@{userData?.username}</h5>
            <h5 className="f_name">{userData?.fullName}</h5>
          </div>
        </div>
        <div className="text-right">
          <a href="#">Switch</a>
        </div>
      </div>
      <div className="sggest">
        <div className="d-flex justify-content-between align-items-center">
          <h4>Suggestions For You</h4>
          <a href="#">See All</a>
        </div>
        {/* Suggested */}
        {followUsers?.length ? (
          followUsers?.map((item, ind) => {
            return (
              <div
                className="d-flex justify-content-between align-items-center mt-4"
                key={ind}
              >
                <div className="d-flex align-items-center">
                  <img
                    src={item?.avatar}
                    alt={item?.avatar}
                    className="avatar"
                  />
                  <div className="ps-3">
                    <h5 className="username">@{item?.username}</h5>
                    <h5 className="sgfy">Suggested for you</h5>
                  </div>
                </div>
                {isFollow?.find((i, ind) => item.uid == i.fuid) ? (
                  <a
                    onClick={() =>
                      unfollowUser(isFollow?.find((i) => i.fuid == item.uid).id)
                    }
                    style={{ color: "rgb(13 ,110, 253)" }}
                  >
                    Unfollow
                  </a>
                ) : (
                  <a
                    onClick={() =>
                      followUser(item?.uid, item?.avatar, item?.username)
                    }
                    style={{ color: "rgb(13 ,110, 253)" }}
                  >
                    Follow
                  </a>
                )}
              </div>
            );
          })
        ) : (
          <div className="mt-4">
            <Suggestion /> <Suggestion /> <Suggestion />
          </div>
        )}
      </div>
      <p>&copy; 2021 INSTAGRAM FROM MUSTAFA</p>
    </div>
  );
};

export default SideHome;
