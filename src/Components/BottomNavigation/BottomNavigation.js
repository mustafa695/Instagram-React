import React from "react";
import { useSelector } from "react-redux";
import { MdHomeFilled, MdOutlineAddComment } from "react-icons/md";
import { IoSearchOutline } from "react-icons/io5";
import { AiOutlineHeart } from "react-icons/ai";
import "./style.scss";
import { Link } from "react-router-dom";
const BottomNavigation = () => {
  const userData = useSelector((state) => state.userData);
  return (
    <div className="bottomNav">
      <div className="menu_icon">
        <ul>
          <li>
            <Link to="/">
              <MdHomeFilled />
            </Link>
          </li>
          <li>
            <a>
              <IoSearchOutline />
            </a>
          </li>
          <li>
            <a>
              <MdOutlineAddComment />
            </a>
          </li>

          <li>
            <a href="#">
              <AiOutlineHeart />
            </a>
          </li>
          <li>
            <Link to="/profile">
            <img className="avatar" src={userData?.avatar} alt="prfile" />
            </Link>
            
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BottomNavigation;
