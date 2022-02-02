import React, { useState } from "react";
import StepWizard from "react-step-wizard";
import Step1 from "../../Components/Steps/Step1";
import Step2 from "../../Components/Steps/Step2";
import { BiImages } from "react-icons/bi";
import { IoCopyOutline } from "react-icons/io5";
import { HiOutlineFilter } from "react-icons/hi";
import filterImage from "../../assets/images/filter.jpg";
const CreatePost = (props) => {
  const [image, setImage] = useState([]);
  const [caption, setCaption] = useState(0);
  const [previewImages, setPreviewImages] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [imageFiltered, setImageFiltered] = useState("none");
  const [widthModal, setWidthModal] = useState(null);

  let noTransitions = {
    enterRight: "",
    enterLeft: "",
    exitRight: "",
    exitLeft: "",
  };
  const filterArr = [
    { name: "Grey-Scale", filter: "grayscale(100%)" },
    { name: "Contrast", filter: "contrast(200%) brightness(150%)" },
    { name: "Sepia", filter: "sepia(100%)" },
    { name: "None", filter: "none" },
  ];
  
  const fileUploadInputChange = (e) => {
    let dupI = [...image];
    dupI.push(e.target.files[0]);
    setImage(dupI);
    let dup = [...previewImages];
    let reader = new FileReader();
    reader.onload = function (e) {
      dup.push(e.target.result);
      setPreviewImages(dup);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div id="postModal">
      <div className="close" onClick={() => props.setShowCrPostModal(false)}>
        &#10006;
      </div>
      <div
        className={
          previewImages?.length
            ? `mdlBox mdlMaxBoxHeight`
            : `mdlBox mdlMinBoxHeight`
          
        }
        style={{ width: widthModal == 2 ? "70%" : "45%" }}
      >
        <h6>Create New post</h6>
        {previewImages.length ? (
          <StepWizard transitions={noTransitions}>
            <Step1
              previewImages={previewImages}
              imageFiltered={imageFiltered}
              setWidthModal={setWidthModal}
              setShowCrPostModal={props.setShowCrPostModal}
            />
            <Step2
              previewImages={previewImages}
              imageFiltered={imageFiltered}
              setWidthModal={setWidthModal}
              caption={caption}
              setCaption={setCaption}
              image={image}
              setShowCrPostModal={props.setShowCrPostModal}
              currentUid={props.currentUid}
            />
          </StepWizard>
        ) : (
          ""
        )}

        {!previewImages.length && (
          <div className="upldArea">
            <div className="upd1">
              <BiImages />
              <h3 className="mb-4">Drag photos and videos here</h3>
            </div>
          </div>
        )}

        <div className="text-center">
          <label className={previewImages.length ? `updBtnAbs` : `updBtn`}>
            {previewImages.length ? (
              <IoCopyOutline size={16} />
            ) : (
              "Select from Computer"
            )}
            <input
              type="file"
              style={{ fontSize: "13.5px", fontWeight: "500" }}
              onChange={(e) => fileUploadInputChange(e)}
            />
          </label>
        </div>
        {previewImages?.length ? (
          <div className="filterModal">
            <div className="boxOfFmd">
              <HiOutlineFilter onClick={toggleFilters} />
              {showFilters && (
                <div className="filterContent">
                  {filterArr.map((item) => {
                    return (
                      <figure>
                        <img
                          src={filterImage}
                          alt="noImage"
                          style={{ filter: `${item.filter}` }}
                          onClick={() => setImageFiltered(item.filter)}
                        />
                        <figcaption>{item.name}</figcaption>
                      </figure>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default CreatePost;
