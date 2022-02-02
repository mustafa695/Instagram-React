import React, { Fragment, useEffect, useState } from "react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import { RiSettings3Line } from "react-icons/ri";
import "./style.scss";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { db } from "../../config/firebase";
import Skeleton from "react-loading-skeleton";
import BottomNavigation from "../../Components/BottomNavigation/BottomNavigation";

const Profile = (props) => {
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const userData = useSelector((state) => state.userData);

  const userPosts = () => {
    setLoader(true);
    db.collection("posts")
      .where("userId", "==", userData.uid)
      .get()
      .then((res) => {
        if (res.docs.length < 1) {
          setLoader(false);
        }
        let post = res.docs.map((i) => i.data());
        setPosts(post);
        setLoader(false);
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
      });
  };
  useEffect(() => {
    userPosts();
  }, []);

  useEffect(() => {
    db.collection("follow")
      .where("uid", "==", userData.uid)
      .get()
      .then((res) => {
        let data = res.docs.map((i) => {
          return { ...i.data(), docId: i.id };
        });
        setFollowing(data);
      })
      .catch((err) => console.log(err));

    db.collection("follow")
      .where("fuid", "==", userData.uid)
      .get()
      .then((res) => {
        let data = res.docs.map((i) => {
          return { ...i.data(), docId: i.id };
        });
        setFollowers(data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <Header />
      <div id="profile">
        <div className="container">
          <section className="prfHead">
            <div className="prfImg">
              <img src={userData?.avatar} alt="noImage" />
            </div>
            <div className="bxMx">
              <div className="prfDtail">
                <h3 className="usr">{userData?.username}</h3>
                <div>
                  <button
                    className="btn_Edt"
                    onClick={() => navigate("/accounts/edit")}
                  >
                    Edit Profile
                  </button>
                </div>
                <div>
                  <RiSettings3Line size={28} />
                </div>
              </div>
              <div className="d-flex justify-content-between mt-4">
                <div>
                  <b>{posts?.length}</b> posts
                </div>
                <div>
                  <b>{followers?.length}</b> followers
                </div>
                <div>
                  <b>{following?.length}</b> following
                </div>
              </div>
              <div className="prfBio mt-4">
                <h5 className="fNme">{userData?.fullName}</h5>
                <p>{userData?.bio}</p>
              </div>
            </div>
          </section>
          <section id="mblViewPorfile">
            <h6>{userData?.fullName}</h6>
            <p>{userData?.bio}</p>
            <hr />
            <div className="postInf">
              <div>
                <h4>{posts?.length}</h4>
                <small>posts</small>
              </div>
              <div>
                <h4>{followers?.length}</h4>
                <small>followers</small>
              </div>
              <div>
                <h4>{following?.length}</h4>
                <small>following</small>
              </div>
            </div>
        
          </section>
          <hr />
          <div className="row mb-4" style={{ marginTop: "2rem" }}>
            {loader ? (
              <Skeleton count={3} style={{ height: "40px" }} />
            ) : (
              posts?.map((item) => {
                return item?.postFiles?.map((data, ind) => {
                  return (
                    <div className="col-md-4" key={ind}>
                      <img src={data} alt={data} className="thumbs_wall" />
                    </div>
                  );
                });
              })
            )}
          </div>
        </div>
      </div>
      <Footer />
      <BottomNavigation />
    </>
  );
};

export default Profile;
