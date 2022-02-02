import React, { useEffect, useState, useRef } from "react";
import Header from "../../Components/Header";
import "./Style.scss";
import Skeleton from "react-loading-skeleton";
import { db } from "../../config/firebase";
import { useSelector } from "react-redux";
const Chat = () => {
  const [message, setMessage] = useState("");
  const [messagesData, setMessagesData] = useState([]);
  const [showUsers, setShowUsers] = useState([]);
  const [readMessages, setReadMessages] = useState(false);
  const [idOfSender, setIdOfSender] = useState("");
  const [loader, setLoader] = useState(false);
  const userData = useSelector((state) => state.userData);
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "auto" });
  };

  const getMessages = async (id) => {
    setIdOfSender(id);
    setReadMessages(true);
    try {
      let rid = await db
        .collection("chat")
        .where("roomIdSender", "==", `${userData.uid}-${id}`)
        .orderBy("created_at", "asc")
        .get();
      let rec = await db
        .collection("chat")
        .where("roomIdRec", "==", `${userData.uid}-${id}`)
        .orderBy("created_at", "asc")
        .get();
      if (rid.docs.length && rec.docs.length) {
        let data = rid.docs.map((i) => i.data());
        let data2 = rec.docs.map((i) => i.data());
        let concat = data2.concat(data);
        let afterSort = concat.sort(function (a, b) {
          return new Date(a.created_at) - new Date(b.created_at);
        });
        setMessagesData(afterSort);
      } else if (rid.docs.length) {
        let data = rid.docs.map((i) => i.data());
        setMessagesData(data);
        scrollToBottom();
      } else if (rec.docs.length) {
        let data2 = rec.docs.map((i) => i.data());
        setMessagesData(data2);
        scrollToBottom();
      } else if (rid.docs.length < 1 && rec.docs.length < 1) {
        setMessagesData([]);
        scrollToBottom();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getChats = async () => {
    setLoader(true);
    scrollToBottom();
    db.collection("users")
      .where("uid", "!=", userData.uid)
      .get()
      .then((res) => {
        if (res.docs.length < 1) {
          setLoader(false);
        }
        let data = res.docs.map((i) => {
          return { data: i.data(), isRead: false };
        });
        setShowUsers(data);
        setLoader(false);
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
      });
  };

  useEffect(() => {
    getChats();
    scrollToBottom();
  }, []);

  const sendMessage = (e, id) => {
    // let ids = "odP6XhpJzDY5ftdmU0Pn3gVF4W73";
   
    e.preventDefault();
    const d = new Date();
    let date = d.toISOString();
    let input = {
      message: message,
      sendId: userData.uid,
      recId: id,
      created_at: date,
      roomIdSender: `${userData.uid}-${id}`,
      roomIdRec: `${id}-${userData.uid}`,
    };
    db.collection("chat")
      .add(input)
      .then((res) => {
        getMessages(id);
        setMessage("");
        scrollToBottom();
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Header />
      <div style={{ marginTop: "5rem" }}>
        <div className="container">
          <div className="chatBoard">
            <div className="box0">
              <h5 className="mb-4">Recomended</h5>
              {showUsers?.map((item, ind) => {
                return item?.data?.uid != userData.uid ? (
                  <div
                    key={ind}
                    className="d-flex align-items-center mb-4"
                    style={{ cursor: "pointer" }}
                    onClick={() => getMessages(item?.data?.uid)}
                  >
                    <img
                      src={item?.data?.avatar}
                      alt={item?.data?.avatar}
                      style={{
                        width: "70px",
                        height: "70px",
                        objectFit: "cover",
                        borderRadius: "55%",
                      }}
                    />
                    <h6 className="ms-2">{item?.data?.fullName}</h6>
                  </div>
                ) : (
                  ""
                );
              })}
            </div>
            <div className="boxMain">
              <div
                className="scrollEffect"
                style={{ display: readMessages ? "block" : "none" }}
                
              >
                {messagesData?.length ? (
                  messagesData?.map((data) => {
                    return data?.sendId == userData?.uid ? (
                      <div className="pos-rel">
                        <div className="sender">
                          {loader ? (
                            <Skeleton
                              count={1}
                              style={{
                                width: "150px",
                                height: "40px",
                                borderRadius: "20px",
                              }}
                            />
                          ) : (
                            <p> {data?.message}</p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="pos-rel">
                        <div className="reciev">
                          {loader ? (
                            <Skeleton
                              count={1}
                              style={{
                                width: "150px",
                                height: "40px",
                                borderRadius: "20px",
                              }}
                            />
                          ) : (
                            <p>{data?.message}</p>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <>
                    <Skeleton
                      count={2}
                      style={{
                        width: "250px",
                        height: "40px",
                        borderRadius: "20px",
                      }}
                    />
                    <div className="d-flex justify-content-end">
                      <Skeleton
                        count={3}
                        style={{
                          width: "150px",
                          height: "40px",
                          borderRadius: "20px",
                        }}
                      />
                    </div>
                  </>
                )}
                <div ref={messagesEndRef}></div>
                <div className="message__box">
                  <form onSubmit={(e) => sendMessage(e, idOfSender)}>
                    <input
                      className="mesage"
                      type="text"
                      placeholder="Message.."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </form>
                </div>
              </div>
            </div>
            {!readMessages && (
              <h3 className="textDefault">Click to view messages</h3>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
