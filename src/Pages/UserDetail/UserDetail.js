import React, { useEffect, useState } from "react";
import Header from "../../Components/Header";
import { db } from "../../config/firebase";
import { useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "../../Pages/Profile/style.scss";

const UserDetail = () => {
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [userData, setUserData] = useState([]);
  const [loader, setLoader] = useState(false);
  const id = useParams();

  useEffect(() => {
    if (id.id) {
      setLoader(true);
      db.collection("posts")
        .where("userId", "==", id.id)
        .get()
        .then((res) => {
          let post = res.docs.map((i) => i.data());
          setPosts(post);
          setLoader(false);
        })
        .catch((err) => {
          console.log(err);
          setLoader(false);
        });

      db.collection("users")
        .doc(id.id)
        .get()
        .then((user) => {
          setUserData(user.data());
        })
        .catch((err) => console.log(err));
    }
  }, [id]);

  useEffect(() => {
    if (id.id) {
      db.collection("follow")
        .where("uid", "==", id.id)
        .get()
        .then((res) => {
          let data = res.docs.map((i) => {
            return { ...i.data(), docId: i.id };
          });
          setFollowing(data);
        })
        .catch((err) => console.log(err));

      db.collection("follow")
        .where("fuid", "==", id.id)
        .get()
        .then((res) => {
          let data = res.docs.map((i) => {
            return { ...i.data(), docId: i.id };
          });
          setFollowers(data);
        })
        .catch((err) => console.log(err));
    }
  }, [id]);

  return (
    <>
      <Header />
      <div id="profile">
        <div className="container">
          {loader ? (
            <div className="row align-items-center">
              <div className="col-md-3">
                <Skeleton style={{ height: "150px",width:'150px',borderRadius:'55%' }} />
              </div>
              <div className="col-md-8">
                <Skeleton style={{ height: "150px" }} />
              </div>
            </div>
          ) : (
            <section className="prfHead">
              <div className="prfImg">
                <img src={userData?.avatar} alt="noImage" />
              </div>
              <div className="bxMx">
                <div className="prfDtail">
                  <h3 className="usr">{userData?.username}</h3>
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
          )}
          <hr />
          <div className="row mb-4" style={{ marginTop: "2rem" }}>
            {posts?.length ? (
              posts?.map((item) => {
                return item?.postFiles?.map((data, ind) => {
                  return (
                    <div className="col-md-4" key={ind}>
                      <img src={data} alt={data} className="thumbs_wall" />
                    </div>
                  );
                });
              })
            ) : (
              <div className="text-center">Sorry No Post Found..</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDetail;
