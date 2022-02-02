import React, {
  Fragment,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import Picker from "emoji-picker-react";
import { Modal, ModalBody } from "reactstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import Cropper from "react-easy-crop";
import Slider from "react-slick";
import { useSelector } from "react-redux";
import Header from "../../Components/Header";
import SideHome from "../../Components/SideHome";
import PostLoader from "../../Components/Loader/PostLoader";
import BottomNavigation from "../../Components/BottomNavigation/BottomNavigation";
import { db, storage } from "../../config/firebase";
import { getCroppedImg } from "../../utils/canvasUtils";
import StoryModal from "./StoryModal";
import { HiDotsHorizontal, HiOutlineDotsHorizontal } from "react-icons/hi";
import { FiLoader, FiSend } from "react-icons/fi";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { BsEmojiSmile } from "react-icons/bs";
import "./style.scss";
import { toast } from "react-toastify";
import UserStoryModal from "./UserStoryModal";
import StoryLoader from "../../Components/Loader/StoryLoader";

const Home = (props) => {
  const [postData, setPostsData] = useState([]);
  const [userStories, setUserStories] = useState([]);
  const [otherStories, setOtherStories] = useState([]);
  const [comment, setComment] = useState("");
  const [commentModal, setCommentModal] = useState("");
  const [commented, setCommented] = useState([]);
  const [cmdPostId, setCmdPostId] = useState("");
  const [cmdUrl, setcmdUrl] = useState([]);
  const [cmdAvatar, setcmdAvatar] = useState("");
  const [cmdUsername, setcmdUsername] = useState("");
  const [cmdCaptions, setcmdCaptions] = useState("");
  const [cmdLikes, setcmdLikes] = useState("");
  const [comDocId, setComDocId] = useState("");
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [canChooseEmoji, setCanChooseEmoji] = useState(false);
  const [modal, setModal] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [showUserStoryModal, setShowUserStoryModal] = useState(false);
  const [commentData, setCommentData] = useState([]);
  const [replyStatus, setReplyStatus] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [cmdRepAvatar, setCmdRepAvatar] = useState("");
  const [lastVisible, setLastVisible] = useState(null);
  const [noMoreFecth, setNoMoreFecth] = useState(false);
  const [isStory, setIsStory] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [storyInd, setStoryInd] = useState("");
  const [storyLoaded, setStoryLoaded] = useState(false);
  const uid = useSelector((state) => state?.userData?.uid);
  const dataOfUser = useSelector((state) => state.userData);

  function timeSince(date) {
    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = seconds / 31536000;

    if (interval > 1) {
      return Math.floor(interval) + " Years ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " Months ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " Days ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " Hours ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " Min ago";
    }
    return Math.floor(seconds) + " seconds ago";
  }

  const getData = async () => {
    let temp = [];
    let cmnts = [];
    try {
      let res = await db
        .collection("posts")
        .orderBy("createdAt", "desc")
        .limit(3)
        .get();
      setLastVisible(res.docs[res.docs.length - 1].data().createdAt);

      for (let i = 0; i < res.docs.length; i++) {
        let likes = await db
          .collection("posts")
          .doc(res.docs[i].id)
          .collection("likes")
          .get();
        let comments = await db
          .collection("posts")
          .doc(res.docs[i].id)
          .collection("comment")
          .get();

        comments?.docs.map((i) => {
          cmnts.push(i.data());
        });

        if (cmnts.length) {
          setCommented(cmnts);
        }
        if (likes.docs.length) {
          let totalLikes = [];
          for (let j = 0; j < likes.docs.length; j++) {
            totalLikes.push(likes.docs[j].data());
          }
          temp.push({
            data: res.docs[i].data(),
            postId: res.docs[i].id,
            likes: totalLikes,
          });
        } else {
          temp.push({
            data: res.docs[i].data(),
            postId: res.docs[i].id,
            likes: [],
          });
        }
      }

      setPostsData(temp);
    } catch (error) {
      console.log(error);
    }
  };

  const getComments = async (id, images, avatar, username, captions, lik) => {
    setcmdUrl(images);
    setcmdAvatar(avatar);
    setcmdUsername(username);
    setcmdCaptions(captions);
    setcmdLikes(lik);
    let temp = [];
    try {
      let coment = await db
        .collection("posts")
        .doc(id)
        .collection("comment")
        .orderBy("created_at", "asc")
        .get();

      if (coment.docs.length) {
        for (let c = 0; c < coment.docs.length; c++) {
          let comActions = await db
            .collection("posts")
            .doc(id)
            .collection("comment")
            .doc(coment.docs[c].id)
            .collection("comActions")
            .get();
          if (comActions.docs.length) {
            let totalComActions = [];
            for (let l = 0; l < comActions.docs.length; l++) {
              totalComActions.push({
                dataOfCommAct: comActions.docs[l].data(),
                likeId: comActions.docs[l].id,
              });
            }
            temp.push({
              data: coment.docs[c].data(),
              comDocId: coment.docs[c].id,
              commentActions: totalComActions,
              view: false,
            });
          } else {
            temp.push({
              data: coment.docs[c].data(),
              comDocId: coment.docs[c].id,
              commentActions: [],
              view: false,
            });
          }
        }
      }
      setCommentData({
        dataRes: temp,
        urls: images,
        avatar: avatar,
        username: username,
        caption: captions,
        like: lik,
      });
    } catch (error) {
      // console.log(error);
    }
  };

  //other stories
  const getOtherSotries = async () => {
    try {
      let temp = [];
      let story = await db
        .collection("story")
        .where("uid", "!=", dataOfUser.uid)
        .get();
      for (let i = 0; i < story.docs.length; i++) {
        let storyUrl = await db
          .collection("story")
          .doc(story.docs[i].id)
          .collection("urls")
          .get();
        let urlTemp = [];
        for (let j = 0; j < storyUrl.docs.length; j++) {
          urlTemp.push(storyUrl.docs[j].data());
        }
        temp.push({
          urls: urlTemp,
          data: story.docs[i].data(),
          id: story.docs[i].id,
        });
      }

      setOtherStories(temp);
    } catch (error) {
      console.log(error);
    }
  };

  //user current story
  const getStories = async () => {
    try {
      let temp = [];
      let story = await db
        .collection("story")
        .where("uid", "==", dataOfUser.uid)
        .get();
      for (let i = 0; i < story.docs.length; i++) {
        let storyUrl = await db
          .collection("story")
          .doc(story.docs[i].id)
          .collection("urls")
          .get();
        let urlTemp = [];
        for (let j = 0; j < storyUrl.docs.length; j++) {
          urlTemp.push(storyUrl.docs[j].data());
        }
        temp.push({
          urls: urlTemp,
          data: story.docs[i].data(),
          id: story.docs[i].id,
        });
      }

      setUserStories(temp);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getData();
    getStories();
    getOtherSotries();
  }, []);

  const likePost = (id, ind) => {
    let input = { like: true, userId: uid, postId: id };
    let dupPost = [...postData];
    let postInd = dupPost[ind];
    let addLike = postInd.likes.push(input);
    setPostsData(dupPost);
    db.collection("posts")
      .doc(id)
      .collection("likes")
      .doc(uid)
      .set(input)
      .then((res) => {
        // getData();
      })
      .catch((err) => console.log(err));
  };

  const disLikePost = (id, indx) => {
    let dup = [...postData];
    let likInd = [...dup[indx].likes];
    let remove = likInd.filter((f) => f.userId != uid);
    likInd = remove;
    dup[indx].likes = likInd;
    setPostsData(dup);
    setTimeout(() => {
      db.collection("posts")
        .doc(id)
        .collection("likes")
        .doc(uid)
        .delete()
        .then((res) => {
          // getData();
        })
        .catch((err) => console.log(err));
    }, 500);
  };

  const addComment = (e, id, comments) => {
    e.preventDefault();
    let date = new Date();
    let currDate = date.toISOString();

    let input = {
      comment: commentModal.length ? commentModal : comment,
      userId: uid,
      postId: cmdPostId.length != undefined ? cmdPostId : id,
      status: true,
      commUserName: dataOfUser?.username,
      commAvatar: dataOfUser?.avatar,
      created_at: currDate,
    };
    let iD = cmdPostId.length != undefined ? cmdPostId : id;

    db.collection("posts")
      .doc(iD)
      .collection("comment")
      .add(input)
      .then((res) => {
        setComment("");
        setCommentModal("");
        getComments(
          cmdPostId,
          cmdUrl,
          cmdAvatar,
          cmdUsername,
          cmdCaptions,
          cmdLikes
        );
      })
      .catch((err) => console.log(err));
  };

  const deleteComment = (
    id,
    postId,
    images,
    avatar,
    username,
    captions,
    lik
  ) => {
    db.collection("posts")
      .doc(postId)
      .collection("comment")
      .doc(id)
      .delete()
      .then((res) => {
        getComments(postId, images, avatar, username, captions, lik);
      })
      .catch((err) => console.log(err));
  };

  const likeComment = (postId, comID) => {
    let input = {
      userId: uid,
      commentId: comID,
      postId: postId,
      like: true,
      text: "",
      type: "like",
    };
    db.collection("posts")
      .doc(postId)
      .collection("comment")
      .doc(comID)
      .collection("comActions")
      .add(input)
      .then((res) => {
        getComments(
          postId,
          cmdUrl,
          cmdAvatar,
          cmdUsername,
          cmdCaptions,
          cmdLikes
        );
      })
      .catch((err) => console.log(err));
  };

  const dislikeComment = (postId, comID, comLikes, id) => {
    db.collection("posts")
      .doc(postId)
      .collection("comment")
      .doc(comID)
      .collection("comActions")
      .doc(id)
      .update({
        like: false,
      })
      .then((res) => {
        getComments(
          postId,
          cmdUrl,
          cmdAvatar,
          cmdUsername,
          cmdCaptions,
          cmdLikes
        );
      })
      .catch((err) => console.log(err));
  };

  const commentReply = (ind, postId, comID) => {
    let comName = commentData?.dataRes[ind];
    setReplyText("@" + comName.data.commUserName + " ");
    setComDocId(comID);
    setReplyStatus(true);
    setCmdRepAvatar(dataOfUser.avatar);
  };

  const addCommentReply = (e, postId) => {
    e.preventDefault();

    let input = {
      userId: uid,
      commentId: comDocId,
      postId: postId,
      like: false,
      text: replyText,
      type: "reply",
      userAvatar: cmdRepAvatar,
      username: dataOfUser?.username,
    };
    db.collection("posts")
      .doc(postId)
      .collection("comment")
      .doc(comDocId)
      .collection("comActions")
      .add(input)
      .then((res) => {
        setReplyStatus(false);
        setReplyText("");
        getComments(
          postId,
          cmdUrl,
          cmdAvatar,
          cmdUsername,
          cmdCaptions,
          cmdLikes
        );
      })
      .catch((err) => console.log(err));
  };

  const commentChildReply = (mainInd, childInd, comID) => {
    let indx = commentData?.dataRes[mainInd];
    let childData = indx?.commentActions[childInd];
    setReplyText("@" + childData?.dataOfCommAct?.username + " ");
    setComDocId(childData?.dataOfCommAct?.commentId);
    setReplyStatus(true);
    setCmdRepAvatar(dataOfUser.avatar);
  };

  const showReplies = (ind) => {
    let dup = [...commentData.dataRes];
    dup[ind].view = true;

    setCommentData({ dataRes: dup });
  };

  const hideReplies = (ind) => {
    let dup = [...commentData.dataRes];
    dup[ind].view = false;

    setCommentData({ dataRes: dup });
  };

  const deleteChildReply = (comment_id, id) => {
    db.collection("posts")
      .doc(cmdPostId)
      .collection("comment")
      .doc(comment_id)
      .collection("comActions")
      .doc(id)
      .delete()
      .then((res) => {
        getComments(
          cmdPostId,
          cmdUrl,
          cmdAvatar,
          cmdUsername,
          cmdCaptions,
          cmdLikes
        );
      })
      .catch((err) => console.log(err));
  };

  const onEmojiClick = (event, emojiObject) => {
    setChosenEmoji(emojiObject);
    setCanChooseEmoji(true);
    setComment(comment + chosenEmoji.emoji);
  };

  const toggle = (id, images, avatar, username, captions, lik) => {
    getComments(id, images, avatar, username, captions, lik);
    setCmdPostId(id);
    setReplyText("");
    setReplyStatus(false);
    setCommentModal("");
    setModal(!modal);
    if (!modal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

  const openStory = (ind) => {
    setStoryInd(ind);
    setShowStoryModal(!showStoryModal);
  };
  const openUserSotry = () => {
    setShowUserStoryModal(!showUserStoryModal);
  };
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 1,
    autoplay: false,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 6,
        },
      },
      {
        breakpoint: 1050,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 821,
        settings: {
          slidesToShow: 6,
        },
      },
      {
        breakpoint: 551,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 425,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 360,
        settings: {
          slidesToShow: 3,
        },
      },
    ],
  };
  const feedsSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
  };
  const fetchMoreData = () => {
    const getMoreData = async () => {
      let temp = [];
      let cmnts = [];
      try {
        let res = await db
          .collection("posts")
          .orderBy("createdAt", "desc")
          .startAfter(lastVisible)
          .limit(3)
          .get();

        if (res.docs.length) {
          setLastVisible(res.docs[res.docs.length - 1].data().createdAt);
        }
        if (res.docs.length === 0) {
          setNoMoreFecth(true);
        } else {
          setNoMoreFecth(false);
        }

        for (let i = 0; i < res.docs.length; i++) {
          let likes = await db
            .collection("posts")
            .doc(res.docs[i].id)
            .collection("likes")
            .get();
          let comments = await db
            .collection("posts")
            .doc(res.docs[i].id)
            .collection("comment")
            .get();

          comments?.docs.map((i) => {
            cmnts.push(i.data());
          });

          if (cmnts.length) {
            setCommented(cmnts);
          }
          if (likes.docs.length) {
            let totalLikes = [];
            for (let j = 0; j < likes.docs.length; j++) {
              totalLikes.push(likes.docs[j].data());
            }
            temp.push({
              data: res.docs[i].data(),
              postId: res.docs[i].id,
              likes: totalLikes,
            });
          } else {
            temp.push({
              data: res.docs[i].data(),
              postId: res.docs[i].id,
              likes: [],
            });
          }
        }

        setPostsData(postData.concat(temp));
      } catch (error) {
        console.log(error);
      }
    };
    setTimeout(() => {
      getMoreData();
    }, 1500);
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  function readFile(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(reader.result), false);
      reader.readAsDataURL(file);
    });
  }

  const storyImageUpload = async (e) => {
    setIsStory(true);
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      let imageDataUrl = await readFile(file);
      setImageSrc(imageDataUrl);
    }
  };
  const showCroppedImage = useCallback(async () => {
    try {
      const { file, cropped } = await getCroppedImg(
        imageSrc,
        croppedAreaPixels
      );

      if (file) {
        createStory(file);
      }
      setCroppedImage(cropped);
    } catch (e) {
      console.error(e);
    }
  }, [imageSrc, croppedAreaPixels]);

  const createStory = (blobFile) => {
    setStoryLoaded(false);
    const d = new Date();
    let ms = d.getMilliseconds();
    let sec = d.getSeconds();
    let min = d.getMinutes();
    let hr = d.getHours();
    let dt = d.getDate();
    let currDate = d.toISOString();
    let storageRef = storage.ref(`stories/${dt}-${hr}-${min}-${sec}-${ms}`);
    storageRef
      .put(blobFile)
      .then((res) => {
        storageRef.getDownloadURL().then((url) => {
          let input = {
            uid: dataOfUser.uid,
            username: dataOfUser.username,
            avatar: dataOfUser.avatar,
            created_at: currDate,
          };
          let urlInput = { url: url };
          if (userStories.length) {
            db.collection("story")
              .where("uid", "==", dataOfUser.uid)
              .get()
              .then((res) => {
                res.docs.map((i) => {
                  db.collection("story")
                    .doc(i.id)
                    .collection("urls")
                    .add(urlInput)
                    .then((res) => {
                      setIsStory(false);
                      setStoryLoaded(false);
                      setImageSrc(null);
                      setShowUserStoryModal(false);
                      toast.success("Story Created Successfully");
                    })
                    .catch((err) => {
                      console.log(err);
                      setStoryLoaded(false);
                    });
                });
              })
              .catch((err) => console.log(err));
          } else {
            db.collection("story")
              .add(input)
              .then((docRef) => {
                db.collection("story")
                  .doc(docRef.id)
                  .collection("urls")
                  .add(urlInput)
                  .then((res) => {
                    setIsStory(false);
                    setStoryLoaded(false);
                    setImageSrc(null);
                    setShowStoryModal(false);
                    toast.success("Story Created Successfully");
                  })
                  .catch((err) => {
                    setStoryLoaded(false);
                    console.log(err);
                  });
              })
              .catch((err) => console.log(err));
          }
        });
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Header />
      <div className="container_feed" id="stryFeeds">
        {otherStories.length && userStories.length ? (
          <Slider {...settings}>
            <div
              className="stryItm"
              onClick={userStories.length && openUserSotry}
            >
              <div className="avtStory userStory">
                <img src={dataOfUser.avatar} alt="noImage" className="avatr" />
                <input
                  type={userStories.length ? "hidden" : "file"}
                  className="createSotry"
                  onChange={storyImageUpload}
                />
              </div>
              <h5 className="namOfStr">Your Story</h5>
            </div>
            {otherStories?.map((item, ind) => {
              return (
                <div
                  className="stryItm"
                  onClick={() => openStory(ind)}
                  key={ind}
                >
                  <div className="avtStory">
                    <img
                      src={item?.data?.avatar}
                      alt="noImage"
                      className="avatr"
                    />
                  </div>
                  <h5 className="namOfStr">{item?.data?.username}</h5>
                </div>
              );
            })}
          </Slider>
        ) : (
          <StoryLoader />
        )}
      </div>

      <div className="container_feed" id="feeds">
        <div className="content">
          <InfiniteScroll
            dataLength={postData.length}
            next={fetchMoreData}
            hasMore={noMoreFecth ? false : true}
            loader={
              <>
                <PostLoader />
              </>
            }
            style={{ overflow: "hidden" }}
          >
            {postData.length ? (
              postData?.map((item, ind) => {
                return (
                  <div className="feeds" key={ind}>
                    <div className="fd_head">
                      <div>
                        <img src={item?.data?.avatar} alt="no-img" />
                        <span>{item?.data?.username}</span>
                      </div>
                      <div>
                        <HiOutlineDotsHorizontal />
                      </div>
                    </div>
                    <Slider {...feedsSettings}>
                      {item?.data?.postFiles?.map((item, ind) => {
                        return (
                          <div className="fd_wall height-300" key={ind}>
                            <img src={item} alt="no-wall" />
                          </div>
                        );
                      })}
                    </Slider>
                    <div className="fd__actions">
                      <div className="fd_inl">
                        <span>
                          {item?.likes?.find(
                            (i, ind) => i.userId == uid && i.like === true
                          ) ? (
                            <AiFillHeart
                              color="#e74856"
                              size={28}
                              onClick={() => disLikePost(item.postId, ind)}
                            />
                          ) : (
                            <AiOutlineHeart
                              color="rgb(38, 38, 38)"
                              size={28}
                              onClick={() => likePost(item.postId, ind)}
                            />
                          )}
                        </span>
                        <span>
                          <FaRegComment />
                        </span>
                        <span>
                          <FiSend />
                        </span>
                      </div>
                      <div>
                        <span>
                          <svg
                            aria-label="Save"
                            className="_8-yf5 "
                            color="#262626"
                            fill="#262626"
                            height="24"
                            role="img"
                            viewBox="0 0 24 24"
                            width="24"
                          >
                            <polygon
                              fill="none"
                              points="20 21 12 13.44 4 21 4 3 20 3 20 21"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                            ></polygon>
                          </svg>
                        </span>
                      </div>
                    </div>
                    <div className="fd_details">
                      <span className="likes">
                        {item?.likes?.length ? item?.likes?.length : "0"} likes
                      </span>
                      <p className="descrpt">{item?.data?.postCaption}</p>
                      <div className="view_repl">
                        <span
                          onClick={() =>
                            toggle(
                              item?.postId,
                              item?.data?.postFiles,
                              item?.data?.avatar,
                              item?.data?.username,
                              item?.data?.postCaption,
                              item?.likes.length
                            )
                          }
                        >
                          {commented?.filter((i) => i.postId == item?.postId)
                            .length
                            ? "View all" +
                              " " +
                              commented?.filter((i) => i.postId == item?.postId)
                                .length +
                              " " +
                              "Comments"
                            : ""}
                        </span>
                      </div>
                      <small>
                        {timeSince(new Date(item?.data?.createdAt))}
                      </small>
                    </div>

                    {canChooseEmoji == item?.postId && (
                      <div className="_emoje">
                        <Picker onEmojiClick={onEmojiClick} />
                      </div>
                    )}
                    <div className="comment_sec">
                      <form
                        onSubmit={(e) =>
                          addComment(e, item.postId, item?.comments)
                        }
                      >
                        {/* onClick={() =>
                            setCanChooseEmoji(
                              canChooseEmoji === item?.postId
                                ? ""
                                : item?.postId
                            ) */}
                        <span
                          onClick={() => setCanChooseEmoji(!canChooseEmoji)}
                          style={{ cursor: "pointer" }}
                        >
                          <BsEmojiSmile size={25} color="#000" />
                        </span>

                        <textarea
                          placeholder="Add Comment"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          required="required"
                        ></textarea>
                        <div>
                          <button className="post_btn" type="submit">
                            Post
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                );
              })
            ) : (
              <>
                <div
                  className="mt-4"
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  {" "}
                  <div className="spinner-border text-danger"></div>
                </div>
                <PostLoader />
              </>
            )}
          </InfiniteScroll>
        </div>
        <SideHome />
      </div>
      <BottomNavigation />
      {/* modal */}

      <Modal isOpen={modal} toggle={toggle} size="xl" id="comment_modal">
        <div className="closed" onClick={toggle}>
          &#10006;
        </div>
        <ModalBody>
          <div className="comment_content">
            <div className="post_thumb">
              <img
                src={
                  (commentData?.urls?.length && commentData?.urls[0]) || cmdUrl
                }
                alt="no_post"
              />
            </div>
            <div className="comment_area">
              <div className="c_head">
                <div className="d-flex align-items-center">
                  <img
                    src={commentData?.avatar || cmdAvatar}
                    alt="no_thumb"
                    className="avatar"
                  />
                  <div>
                    <a href="#">
                      {commentData?.username || cmdUsername} &nbsp; •{" "}
                    </a>
                  </div>
                </div>
                <HiDotsHorizontal />
              </div>
              <div className="mxHeght">
                <div className="pstDscrp">
                  <div className="d-flex justify-content-center">
                    <img
                      src={commentData?.avatar || cmdAvatar}
                      alt="profile"
                      className="avatar"
                    />
                    <div className="cmbox">
                      <p>
                        <a href="#">{commentData?.username || cmdUsername}</a>{" "}
                        {commentData?.caption || cmdCaptions}
                      </p>
                      <small>22h</small>
                    </div>
                  </div>
                </div>

                <div id="usrCmnt">
                  {commentData?.dataRes?.map((data, ind) => {
                    return (
                      <Fragment key={ind}>
                        <div
                          className="d-flex justify-content-center mb-3"
                          key={ind}
                        >
                          <img
                            src={data?.data?.commAvatar}
                            alt="profile"
                            className="avatar"
                          />
                          <div className="cmbox">
                            <p>
                              <a href="#">{data?.data?.commUserName}</a>{" "}
                              {data?.data?.comment}
                            </p>
                            <small>22h</small>
                            <span>{data?.comentLikes?.length} Likes</span>
                            <span
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                commentReply(ind, cmdPostId, data?.comDocId)
                              }
                            >
                              Reply
                            </span>
                            {data?.data?.userId == uid ? (
                              <span
                                onClick={() =>
                                  deleteComment(
                                    data?.comDocId,
                                    cmdPostId,
                                    cmdUrl,
                                    cmdAvatar,
                                    cmdUsername,
                                    cmdCaptions,
                                    cmdLikes
                                  )
                                }
                                className="ms-2"
                                style={{ cursor: "pointer" }}
                              >
                                Delete
                              </span>
                            ) : (
                              ""
                            )}
                            {data?.commentActions?.find(
                              (i, ind) =>
                                i.dataOfCommAct.userId == uid &&
                                i.dataOfCommAct.like == true
                            ) ? (
                              <>
                                {data?.commentActions
                                  ?.filter(
                                    (r) =>
                                      r.dataOfCommAct.userId == uid &&
                                      r.dataOfCommAct.like == true
                                  )
                                  .map((item, ind) => {
                                    return (
                                      <div
                                        key={ind}
                                        className="hearth"
                                        onClick={() =>
                                          dislikeComment(
                                            cmdPostId,
                                            data?.comDocId,
                                            data?.comentLikes,
                                            item?.likeId
                                          )
                                        }
                                      >
                                        <AiFillHeart color="red" />
                                      </div>
                                    );
                                  })}
                              </>
                            ) : (
                              <div
                                className="hearth"
                                onClick={() =>
                                  likeComment(cmdPostId, data?.comDocId)
                                }
                              >
                                <AiOutlineHeart />
                              </div>
                            )}
                          </div>
                        </div>
                        <div
                          className="view__replies"
                          onClick={() => {
                            data?.view === false
                              ? showReplies(ind)
                              : hideReplies(ind);
                          }}
                        >
                          {data?.commentActions?.find(
                            (c) => c?.dataOfCommAct.type === "reply"
                          ) && (
                            <span>
                              {data?.view === false
                                ? "____ View Replies"
                                : "____ Hide Replies"}
                            </span>
                          )}
                        </div>
                        {data?.view === true ? (
                          <div className="replies">
                            {data?.commentActions?.map((rep, index) => {
                              return rep?.dataOfCommAct?.type == "reply" ? (
                                <>
                                  <div
                                    key={index}
                                    className="d-flex align-items-start mb-3"
                                    style={{ position: "relative" }}
                                  >
                                    <div>
                                      <img
                                        src={rep?.dataOfCommAct?.userAvatar}
                                        alt="noImage"
                                        style={{
                                          width: "28px",
                                          height: "28px",
                                          objectFit: "cover",
                                          borderRadius: "55%",
                                        }}
                                      />
                                    </div>
                                    <div className="mx-3">
                                      <a>@{rep?.dataOfCommAct?.username}</a>
                                      <span>{rep?.dataOfCommAct?.text}</span>
                                      <div className="posAbs0">
                                        <AiOutlineHeart />
                                      </div>
                                      <div className="replyAbs">
                                        <span
                                          style={{ fontWeight: "400" }}
                                          className="me-2"
                                        >
                                          11h
                                        </span>
                                        <span
                                          className="me-2"
                                          onClick={() =>
                                            commentChildReply(
                                              ind,
                                              index,
                                              cmdPostId,
                                              data?.comDocId
                                            )
                                          }
                                        >
                                          Reply
                                        </span>
                                        <span
                                          onClick={() =>
                                            deleteChildReply(
                                              rep?.dataOfCommAct?.commentId,
                                              rep?.likeId
                                            )
                                          }
                                        >
                                          Delete
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              ) : (
                                ""
                              );
                            })}
                          </div>
                        ) : (
                          ""
                        )}
                      </Fragment>
                    );
                  })}
                </div>
              </div>

              <section className="btmBox">
                <hr />
                <div className="d-flex align-items-center">
                  <span>
                    <AiOutlineHeart />
                  </span>
                  <span>
                    <FaRegComment />
                  </span>
                  <span>
                    <FiSend />
                  </span>
                </div>

                <h5 className="likes">{commentData?.like || cmdLikes} likes</h5>
                <small>18 Hour Ago</small>
                <div className="cmntsec">
                  <form
                    onSubmit={(e) => {
                      replyStatus
                        ? addCommentReply(e, cmdPostId)
                        : addComment(e, cmdPostId);
                    }}
                  >
                    <div
                      className="d-flex align-items-center"
                      style={{ flex: 1 }}
                    >
                      <span
                        onClick={() => setCanChooseEmoji(!canChooseEmoji)}
                        style={{ cursor: "pointer" }}
                      >
                        <BsEmojiSmile size={25} color="#000" />
                      </span>
                      <textarea
                        placeholder="Add Comment"
                        value={replyStatus ? replyText : commentModal}
                        onChange={(e) => {
                          replyStatus
                            ? setReplyText(e.target.value)
                            : setCommentModal(e.target.value);
                        }}
                        required="required"
                      ></textarea>
                    </div>

                    <div>
                      <button className="post_btn" type="submit">
                        Post
                      </button>
                    </div>
                  </form>
                </div>
              </section>
            </div>
          </div>
        </ModalBody>
      </Modal>

      {showStoryModal && (
        <StoryModal
          setShowStoryModal={setShowStoryModal}
          otherStories={otherStories}
          storyInd={storyInd}
        />
      )}
      {showUserStoryModal && (
        <UserStoryModal
          setShowUserStoryModal={setShowUserStoryModal}
          storyImageUpload={storyImageUpload}
          userStories={userStories}
        />
      )}
      {isStory && (
        <>
          <div className="crtSotry">
            <button className="btn btn-primary" onClick={showCroppedImage}>
              {storyLoaded ? <FiLoader /> : "Create Story"}
            </button>
          </div>
          <h2 className="closeD" onClick={() => setIsStory(false)}>
            X
          </h2>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={9 / 16}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </>
      )}
    </>
  );
};

export default Home;
