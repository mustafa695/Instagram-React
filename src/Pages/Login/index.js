import React, { useState } from "react";
import { auth } from "../../config/firebase";
import { Link, useNavigate } from "react-router-dom";
import { AiFillFacebook } from "react-icons/ai";
import login_img from "../../assets/images/login_1.png";
import apple from "../../assets/images/apple.png";
import google from "../../assets/images/google.png";
import login_img2 from "../../assets/images/login_2.jpg";
import { FaSpinner } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const login = (e) => {
    e.preventDefault();
    setLoader(true);
    auth
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        setTimeout(() => {
          setLoader(false);
          navigate("/");
        }, 1500);
      })
      .catch((err) => {
        setLoader(false);
        setErrMessage(err.message);
      });
  };
  return (
    <div className="container" id="__login">
      <div className="login_cnt mt-4">
        <div className="insta_lft">
          <img src={login_img} alt="no-image" />
          <div className="psabsl">
            <img src={login_img2} alt="no-image" />
          </div>
        </div>
        <div>
          <div className="login__box">
            <h3 className="main_title">Instagram</h3>
            <h6
              className="mb-3 text-danger"
              style={{ maxWidth: "fit-content" }}
            >
              {errMessage && errMessage.split(":")[1]?.split("(")[0]}
            </h6>
            <div>
              <form onSubmit={login}>
                <div>
                  <input
                    type="text"
                    className="main__input"
                    placeholder="Phone Number, username, or email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Password"
                    className="main__input"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div>
                  <button
                    disabled={loader ? true : false}
                    className="main__btn"
                    type="submit"
                  >
                    Log In {loader && <FaSpinner className="fa-spin" />}
                  </button>
                </div>
              </form>
              <div className="or_line">
                <h5 className="text-center">OR</h5>
              </div>
              <div className="login__with_fb">
                <AiFillFacebook size={24} color="#385185" />
                <span>Login with Facebook</span>
              </div>
              <div className="text-center">
                <a href="#">Forgot Password?</a>
              </div>
            </div>
          </div>
          <div className="dhac">
            <span>Don't have an account? </span>
            <span>
              <Link to="/signup">Sign up</Link>
            </span>
          </div>
          <div className="gtheapp">
            <p>Get the app.</p>
            <div className="d-flex justify-content-center">
              <img className="gth_img" src={apple} alt="apple" />
              <img className="gth_img ms-2" src={google} alt="goolge" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
