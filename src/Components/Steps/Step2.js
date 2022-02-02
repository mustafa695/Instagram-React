import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { db, storage } from "../../config/firebase";
import { Collapse } from "reactstrap";
import { BiArrowBack } from "react-icons/bi";
import { BsEmojiSmile } from "react-icons/bs";
import prf1 from "../../assets/images/prf-1.jpg";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const Step2 = (props) => {
  const [value, setValue] = useState(null);
  const [collapse, setCollapse] = useState(false);
  const [loader, setLoader] = useState(false);
  const userData = useSelector((state) => state.userData);
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };
  const toggle = () => {
    setCollapse(!collapse);
  };

  //uplaod Files
  let i = 0;
  let arrImage = [];
  function uploadFilesFunc() {
    if (props.image.length) {
      setLoader(true);
      let item = props.image[i];

      let storageRef = storage.ref(`images/${item.name}`);

      storageRef.put(item).then((res) => {
        storageRef
          .getDownloadURL()
          .then((url) => {
            arrImage.push(url);

            if (i + 1 < props.image.length) {
              i++;
              uploadFilesFunc(props.image[i]);
            } else {
              i = 0;
              submitPost(arrImage);
            }
          })
          .catch((err) => {
            setLoader(false);
            console.log(err);
          });
      });
    }
  }

  const submitPost = async (urls) => {
    let caption = props.caption;
    let CId = props?.currentUid;
    let date = new Date();
    let currDate = date.toISOString();
    let input = {
      userId: props?.currentUid,
      postCaption: caption,
      postFiles: arrImage,
      location: value?.label ? value?.label : "null",
      createdAt: currDate,
      avatar: userData.avatar,
      username: userData.username,
    };
    db.collection("posts")
      .add(input)
      .then((res) => {
        props.setShowCrPostModal(false);
        setLoader(false);
        toast.success("Your post created successfully.");
      })
      .catch((err) => {
        setLoader(false);
        console.log(err);
      });
  };

  return (
    <>
      <div className="row" id="step2">
        <div className="col-lg-7 col-6">
          <Slider {...settings}>
            {props.previewImages?.map((i, ind) => {
              return (
                <div className="sliderBox" key={ind}>
                  {i.split(";")[0] == "data:video/mp4" ? (
                    <video width="520" height="460" loop muted autoPlay>
                      <source src={i} type="video/mp4" />
                      <source src={i} type="video/ogg" />
                    </video>
                  ) : (
                    <img
                      src={i}
                      alt="noImage"
                      className="w-100"
                      style={{
                        height: "460px",
                        filter: `${props.imageFiltered}`,
                      }}
                    />
                  )}
                </div>
              );
            })}
          </Slider>
        </div>
        <div className="col-lg-5 col-6" id="rightForm">
          <div className="pe-3">
            <div className="d-flex mt-3 align-items-center">
              <img
                src={prf1}
                alt="noImage"
                style={{
                  width: "28px",
                  height: "28px",
                  objectFit: "cover",
                  borderRadius: "55%",
                }}
              />
              <span className="ms-2" style={{ fontWeight: "500" }}>
                i_m_mustafa00
              </span>
            </div>
            <div>
              <textarea
                placeholder="Write a caption..."
                onChange={(e) => props.setCaption(e.target.value)}
                maxlength="2200"
              ></textarea>
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <BsEmojiSmile size={22} />
              </div>
              <div>
                <span>{`${
                  props.caption.length ? props.caption.length : `0`
                }/2200`}</span>
              </div>
            </div>

            <div className="mt-3">
              <GooglePlacesAutocomplete
                apiKey="AIzaSyDyHw1ODJ-q3HKSneTCp6N66sKaLLjx-84"
                selectProps={{
                  value,
                  onChange: setValue,
                  placeholder: "Add Location",
                }}
              />
            </div>

            <div>
              <button className="toggle_btn" onClick={toggle}>
                Advanced Settings
              </button>
              <Collapse isOpen={collapse}>
                <div className="d-flex justify-content-between align-items-center">
                  <span style={{ fontSize: "16px", color: "#000" }}>
                    Turn off commenting
                  </span>
                  <div clasName="custom-control custom-switch">
                    <input
                      type="checkbox"
                      clasName="custom-control-input"
                      id="switch1"
                      name="example"
                    />
                  </div>
                </div>
              </Collapse>
            </div>
          </div>
        </div>
      </div>
      <button onClick={props.previousStep} className="prevBtn">
        <BiArrowBack size={24} />
      </button>
      <button
        disabled={loader ? true : false}
        onClick={uploadFilesFunc}
        className="nxTBtn"
      >
        {loader ? <FaSpinner /> : "Share"}
      </button>
    </>
  );
};

export default Step2;
