import React, { useState } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { MdHomeFilled, MdOutlineAddComment } from "react-icons/md";
import {
  AiOutlineCompass,
  AiOutlineHeart,
  AiOutlineLogout,
} from "react-icons/ai";
import { auth, db } from "../config/firebase";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import CreatePost from "../Pages/Home/CreatePost";
import { CgProfile } from "react-icons/cg";
import { FiSend } from "react-icons/fi";
import { BsSave } from "react-icons/bs";
import { RiSettings3Line } from "react-icons/ri";
import AutoComplete from "./AutoComplete/AutoComplete";
import { logoutUser } from "../store/action";

const Header = (props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifydownOpen, setNotifydownOpen] = useState(false);
  const [showCrPostModal, setShowCrPostModal] = useState(false);
  const userData = useSelector((state) => state.userData);
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggle = () => {
    setDropdownOpen(!dropdownOpen);
  };
  const notifyToggle = () => {
    setNotifydownOpen(!notifydownOpen);
  };

  const logout = () => {
    auth
      .signOut()
      .then((res) => {
        dispatch(logoutUser());
        navigate("/");
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div className="header">
        <div className="containers">
          <div className="header_flx">
            <div
              className="logo"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/")}
            >
              <h3>Instagram</h3>
            </div>
            {userData.uid ? (
              <div className="search__bar">
                <AutoComplete
                  data={searchResults}
                  setSearchResults={setSearchResults}
                />
              </div>
            ) : (
              ""
            )}

            {userData.uid ? (
              <div className="menu_icon">
                <ul>
                  <li>
                    <Link to="/">
                      <MdHomeFilled />
                    </Link>
                  </li>
                  <li onClick={() => navigate("/chat")}>
                    <a>
                      <FiSend />
                    </a>
                  </li>
                  <li onClick={() => setShowCrPostModal(true)}>
                    <a>
                      <MdOutlineAddComment />
                    </a>
                  </li>
                  <li>
                    <a>
                      <AiOutlineCompass />
                    </a>
                  </li>
                  <li id="show__Followers">
                    <a>
                      <Dropdown isOpen={notifydownOpen} toggle={notifyToggle}>
                        <DropdownToggle className="btn_drop">
                          <AiOutlineHeart />
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem className="dropSize">
                            <div className="d-flex align-items-center">
                              <CgProfile size={17} />{" "}
                              <div className="ms-2">Profile</div>
                            </div>
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </a>
                  </li>
                  <li>
                    <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                      <DropdownToggle className="btn_drop">
                        <img
                          className="avatar"
                          src={userData?.avatar}
                          alt="prfile"
                        />
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem onClick={() => navigate("/profile")}>
                          <div className="d-flex align-items-center">
                            <CgProfile size={17} />{" "}
                            <div className="ms-2">Profile</div>
                          </div>
                        </DropdownItem>
                        <DropdownItem>
                          <div className="d-flex align-items-center">
                            <BsSave size={17} />{" "}
                            <div className="ms-2">Saved</div>
                          </div>
                        </DropdownItem>
                        <DropdownItem>
                          <div className="d-flex align-items-center">
                            <RiSettings3Line size={17} />{" "}
                            <div className="ms-2">Settings</div>
                          </div>
                        </DropdownItem>
                        <DropdownItem divider />

                        <DropdownItem>
                          <div
                            className="d-flex align-items-center"
                            onClick={logout}
                          >
                            <AiOutlineLogout size={17} />{" "}
                            <div className="ms-2">Log Out</div>
                          </div>
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </li>
                </ul>
              </div>
            ) : (
              <div>
                <button className="headerLoginBtn" onClick={() => navigate("/")}>Log In</button>
                <button className="headerSignup" onClick={() => navigate("/signup")}>Sign Up</button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/*post modal */}

      {showCrPostModal && (
        <CreatePost
          currentUid={userData.uid}
          setShowCrPostModal={setShowCrPostModal}
        />
      )}
    </>
  );
};

export default Header;
