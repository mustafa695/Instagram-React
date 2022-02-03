import React, { useEffect, useState } from "react";
import Header from "../../Components/Header";
import SideMenu from "./SideMenu";
import { useNavigate } from "react-router-dom";
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import "./style.scss";
import { useDispatch, useSelector } from "react-redux";
import { db, storage } from "../../config/firebase";
import { loginUserData } from "../../store/action";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import BottomNavigation from "../../Components/BottomNavigation/BottomNavigation";

const EditProfile = (props) => {
  const [modal, setModal] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [webiste, setWebiste] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loader, setLoader] = useState(false);
  const [profileImage, setProfileImage] = useState([]);
  const userData = useSelector((state) => state.userData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (userData) {
      setName(userData.fullName);
      setUsername(userData.username);
      setWebiste(userData.webiste);
      setBio(userData.bio);
      setEmail(userData.email);
      setPhone(userData.phoneNumber);
    }
  }, []);

  const toggle = () => {
    setModal(!modal);
  };

  const onUpdateUserFunc = () => {
    db.collection("users")
      .doc(userData.uid)
      .get()
      .then((res) => {
        dispatch(loginUserData(res.data()));
      })
      .catch((err) => console.log(err));
  };

  const updateProfile = (e) => {
    e.preventDefault();
    setLoader(true);
    db.collection("users")
      .doc(userData.uid)
      .update({
        fullName: name,
        username: username,
        webiste: webiste,
        bio: bio,
        phoneNumber: phone,
      })
      .then((doc) => {
        onUpdateUserFunc();
        navigate("/profile");
        setLoader(false);
      })
      .catch((err) => {
        setLoader(false);
        console.log(err);
      });
  };

  const onChangeProfile = (e) => {
    setProfileImage(e.target.files[0]);
    let imageName = e.target.files[0].name;

    if (imageName) {
      setTimeout(() => {
        setLoader(true);
        setModal(false);
        let storageRef = storage.ref(`profile/${imageName}`);
        storageRef
          .put(e.target.files[0])
          .then((res) => {
            storageRef
              .getDownloadURL()
              .then((url) => {
                db.collection("users")
                  .doc(userData.uid)
                  .update({
                    avatar: url,
                  })
                  .then((res) => {
                    onUpdateUserFunc();
                    toast.success("Profile Change Successfully.");
                    setLoader(false);
                  })
                  .catch((err) => {
                    setLoader(false);
                    console.log(err);
                  });
              })
              .catch((err) => {
                setLoader(false);
                console.log(err);
              });
          })
          .catch((err) => {
            setLoader(false);
            console.log(err);
          });
      }, 1000);
    }
  };

  const removeProfile = () => {
    db.collection("users")
      .doc(userData.uid)
      .update({
        avatar:
          "https://firebasestorage.googleapis.com/v0/b/instagram-563fe.appspot.com/o/images%2Fdefault_avatar.jpg?alt=media&token=8292d541-0310-4ebb-a64c-952f4a38aafc",
      })
      .then((res) => {
        let url = userData?.avatar
        let imageRef = storage.refFromURL(url);
        imageRef.delete();
        onUpdateUserFunc();
        setModal(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Header />
      <div style={{ marginTop: "7rem" }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-12 mx-auto">
              <div className="d-flex" id="edtProfile">
                <div>
                  <SideMenu />
                </div>
                <div className="edtContent">
                  <div className="prfHead">
                    <div className="edtLabWidth">
                      <div className="prfImageDiv">
                        <img
                          src={userData.avatar}
                          alt="noImage"
                          style={{ opacity: loader ? "0.5" : "1" }}
                        />
                        {loader && <FaSpinner size={18} />}
                      </div>
                    </div>
                    <div className="edtDataWidth">
                      <h5>{userData.username}</h5>
                      <a onClick={toggle}>Change Profile Photo</a>
                      {/* <label>
                        <a onClick={toggle}>Change Profile Photo</a>
                        <input type="file" />
                      </label> */}
                    </div>
                  </div>
                  <form onSubmit={updateProfile} className="my-4">
                    <div className="d-flex">
                      <div className="edtLabWidth">
                        <h6 className="mt-2">Name</h6>
                      </div>
                      <div className="edtDataWidth">
                        <input
                          className="frm_inpt"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                        <p>
                          Help people discover your account by using the name
                          you're known by: either your full name, nickname, or
                          business name.
                          <br />
                          <br /> You can only change your name twice within 14
                          days.
                        </p>
                      </div>
                    </div>
                    <div className="d-flex">
                      <div className="edtLabWidth">
                        <h6 className="mt-2">Username</h6>
                      </div>
                      <div className="edtDataWidth">
                        <input
                          className="frm_inpt"
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                        <p>
                          In most cases, you'll be able to change your username
                          back to i_m_mustafa00 for another 14 days. Learn More
                        </p>
                      </div>
                    </div>
                    <div className="d-flex">
                      <div className="edtLabWidth">
                        <h6 className="mt-2">Website</h6>
                      </div>
                      <div className="edtDataWidth">
                        <input
                          className="frm_inpt"
                          type="text"
                          placeholder="Website"
                          value={webiste}
                          onChange={(e) => setWebiste(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="d-flex mt-2">
                      <div className="edtLabWidth">
                        <h6 className="mt-2">Bio</h6>
                      </div>
                      <div className="edtDataWidth">
                        <textarea
                          className="frm_inpt"
                          type="text"
                          placeholder="Your Bio."
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                        ></textarea>
                        <p>
                          <strong>Personal Information</strong>
                          <br /> Provide your personal information, even if the
                          account is used for a business, a pet or something
                          else. This won't be a part of your public profile.
                        </p>
                      </div>
                    </div>
                    <div className="d-flex">
                      <div className="edtLabWidth">
                        <h6 className="mt-2">Email</h6>
                      </div>
                      <div className="edtDataWidth">
                        <input
                          className="frm_inpt"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={true}
                        />
                      </div>
                    </div>
                    <div className="d-flex mt-2">
                      <div className="edtLabWidth">
                        <h6 className="mt-2">Phone Number</h6>
                      </div>
                      <div className="edtDataWidth">
                        <input
                          className="frm_inpt"
                          type="number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                    </div>
                    {/* <div className="d-flex mt-2">
                      <div className="edtLabWidth">
                        <h6 className="mt-2">Gender</h6>
                      </div>
                      <div className="edtDataWidth">
                        <input className="frm_inpt" type="text" value="Male" />
                      </div>
                    </div> */}
                    <div>
                      <div className="d-flex mt-2">
                        <div className="edtLabWidth"></div>
                        <div className="edtDataWidth">
                          <div className="d-flex align-items-center justify-content-between">
                            <div>
                              <button
                                type="submit"
                                disabled={loader ? true : false}
                                type="submit"
                                className="__btn"
                              >
                                Submit
                              </button>
                            </div>
                            <div>
                              <a>Temporarily disable my account</a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BottomNavigation />
      <Modal
        size="md"
        centered={true}
        isOpen={modal}
        toggle={toggle}
        id="edtPrfModal"
      >
        <ModalHeader toggle={toggle} className="text-center">
          Change Profile Photo
        </ModalHeader>
        <ModalBody>
          <label
            className="btn__mdl text-primary"
            style={{ cursor: "pointer" }}
          >
            <input type="file" onChange={(e) => onChangeProfile(e)} />
            Upload Photo
          </label>
          <button className="btn__mdl text-danger" onClick={removeProfile}>
            Remove Current Photo
          </button>
          <button className="btn__mdl" onClick={toggle}>
            Cancel
          </button>
        </ModalBody>
      </Modal>
    </>
  );
};

export default EditProfile;
