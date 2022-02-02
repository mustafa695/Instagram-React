import React, { useEffect, useState } from "react";
import { auth, db } from "./config/firebase";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Home from "./Pages/Home/Home";
import Profile from "./Pages/Profile/Profile";
import Chat from "./Pages/Chat/Chat";
import EditProfile from "./Pages/EditProfile/EditProfile";
import UserDetail from "./Pages/UserDetail/UserDetail";
import { loginUserData } from "./store/action";
import "react-toastify/dist/ReactToastify.css";
import "react-loading-skeleton/dist/skeleton.css";
import "./App.css";
import "./App.scss";
import "./utils/responsive.scss";
import NotFound from "./Components/NotFound/NotFound";

function App() {
  const [currentUid, setCurrentUid] = useState("");

  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userData);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setCurrentUid(user.uid);
      db.collection("users")
        .doc(user.uid)
        .get()
        .then((res) => {
          dispatch(loginUserData(res.data()));
        })
        .catch((err) => console.log(err));
    });
  }, [currentUid]);

  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          <Route exact path="/signup" element={<Signup />} />
          {userData.uid ? (
            <>
              <Route
                exact
                path="/"
                element={<Home currentUid={currentUid} />}
              />
              <Route
                exact
                path="/profile"
                element={
                  <Profile userData={userData} currentUid={currentUid} />
                }
              />
              <Route
                exact
                path="/accounts/edit"
                element={
                  <EditProfile userData={userData} currentUid={currentUid} />
                }
              />
              <Route
                exact
                path="/profile/:id"
                element={<UserDetail userData={userData} />}
              />
              <Route
                exact
                path="/chat"
                element={<Chat userData={userData} />}
              />
            </>
          ) : (
            <>
              <Route exact path="/" element={<Login />} />
              <Route exact path="/:id" element={<NotFound />} />
            </>
          )}
        </Routes>
      </Router>
    </>
  );
}

export default App;
