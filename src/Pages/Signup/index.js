import React, { useEffect, useState } from "react";
import { auth, db } from "../../config/firebase";
import { toast } from "react-toastify";
import { AiFillFacebook } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import apple from "../../assets/images/apple.png";
import google from "../../assets/images/google.png";
import Footer from "../../Components/Footer";
import { FaSpinner } from "react-icons/fa";

const Signup = () => {
  const [userData, setUserData] = [];
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [disabledBtn, setDisabledBtn] = useState(true);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (email && fullName && username && password) {
      setDisabledBtn(false);
    } else {
      setDisabledBtn(true);
    }
  }, [email, fullName, username, password]);



  const navigate = useNavigate();
  const register = (e) => {
    e.preventDefault();
    setLoader(true);
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        let uid = userCredential.user.uid;
        let date = new Date();
        let currDate = date.toISOString();
        let defaultAvatr =
          "https://firebasestorage.googleapis.com/v0/b/instagram-563fe.appspot.com/o/images%2Fdefault_avatar.jpg?alt=media&token=8292d541-0310-4ebb-a64c-952f4a38aafc";
        let input = {
          email,
          fullName,
          username,
          password,
          uid,
          webiste: "",
          bio: "",
          phoneNumber: "",
          createAt: currDate,
          avatar: defaultAvatr,
        };
        db.collection("users")
          .doc(uid)
          .set(input)
          .then((res) => {
            setLoader(false);
            navigate("/");
          })
          .catch((err) => {
            setLoader(false);
            console.log(err);
          });
      })
      .catch((err) => {
        setLoader(false);
        toast.error(err.message);
      });
  };
  return (
    <div className="contianer" id="signup">
      <div className="signup_box">
        <h3 className="main_title">Instagram</h3>
        <p>Sign up to see photos and videos from your friends.</p>
        <div>
          <button className="lg_wi_fb">
            {" "}
            <AiFillFacebook size={24} color="#fff" size={22} />
            <span className="ms-1 mt-1">Log in with Facebook</span>
          </button>
        </div>
        <div className="or_line mt-4 mb-3">
          <h5 className="text-center">OR</h5>
        </div>
        <form onSubmit={register}>
          <div>
            <input
              type="text"
              className="main__input"
              placeholder="Mobile Number or Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              className="main__input"
              placeholder="Full Name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              className="main__input"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              disabled={disabledBtn ? true : false}
              className="main__btn"
              type="submit"
            >
              Sign up {loader && <FaSpinner className="fa-spin" />}
            </button>
          </div>
        </form>
        <p className="_policy">
          By signing up, you agree to our Terms , Data Policy and Cookies Policy
          .
        </p>
      </div>
      <div className="dhac mx-auto w-set">
        <span>Have an account? </span>
        <span>
          <Link to="/" href="#">
            Log in
          </Link>
        </span>
      </div>
      <div className="gtheapp mx-auto w-set">
        <p>Get the app.</p>
        <div className="d-flex justify-content-center">
          <img className="gth_img" src={apple} alt="apple" />
          <img className="gth_img ms-2" src={google} alt="goolge" />
        </div>
      </div>
      <div className="mt-4">
        <Footer />
      </div>
    </div>
  );
};

export default Signup;
