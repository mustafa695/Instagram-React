import React, { useEffect } from "react";
import Slider from "react-slick";
import { BiArrowBack } from "react-icons/bi";

const Step1 = (props) => {
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };
  useEffect(() => {
    props.setWidthModal(props.currentStep);
  }, [props.currentStep]);

  const discardPost = () => {
    let text = "If you leave, your edits won't be saved.";
    if (window.confirm(text) == true) {
      props.setShowCrPostModal(false);
    }
  };
  return (
    <div>
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
                  style={{ height: "460px", filter: `${props.imageFiltered}` }}
                />
              )}
            </div>
          );
        })}
      </Slider>
      <button onClick={discardPost} className="prevBtn">
        <BiArrowBack size={24} />
      </button>
      <button onClick={props.nextStep} className="nxTBtn">
        Next
      </button>
    </div>
  );
};

export default Step1;
