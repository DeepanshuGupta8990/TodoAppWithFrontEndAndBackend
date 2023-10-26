import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { Peer } from "peerjs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import Tooltip from "@mui/material/Tooltip";
import callingGif from "../images/calling.gif";
import VideoCallIcon from "@mui/icons-material/VideoCall";


export default function Chat() {
  const socket = useRef(null); 
  const peer = new Peer({
    iceServers: [
      { urls: ["stun:stun.l.google.com:19302"] },
      { urls: ["stun:stun2.l.google.com:19302"] },
    ],
  });
  const navigate = useNavigate();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [connRequestAccepted, setConnRequestAccepted] = useState(false);
  const [peerId, setPeerId] = useState("");
  let sendFunc = useRef(null);
  const [counter, setCounter] = useState(1);
  const [connn, setConnn] = useState(null);
  const connectRef = useRef(null);
  const [callerEmail,setCallerEmail] = useState("");

  const [connecting, setConnecting] = useState(false);
  let userInfo;
  let dataConnection1;
  let dataConnection;
  let otheruserId;
  let userDetails = useRef({});
  const entry1 = useRef(true);
  function handleToastClose() {
    if (entry1.current) {
     socket.current.emit("RejectConnection", {
        user: userDetails.current,
        text: "Rejected your call",
      });
    }
  }
  function connectPeer(PeerId, user) {
    // console.log("running connectpeer func", PeerId, "sdsdsdsdsd");
    // console.log(PeerId);
    dataConnection = peer.connect(PeerId);
    const userrr = { ...user };
    delete userrr.peerId;
    setConnRequestAccepted(true);
    setSelectedChat(user);
    dataConnection.on("open", function () {
      // alert("Data connection opened. You are now connected with " + PeerId);
      toast.success(`You are now connected with ${PeerId}`, toastOptions);
      setConnecting(false);
    });

    dataConnection.on("data", (data) => {
      console.log(data);
    });
    sendFunc.current = (data) => {
      dataConnection.send(data);
    };
    console.log(dataConnection);
    setConnn(dataConnection);
    connectRef.current = dataConnection;
    setCounter((counter) => counter++);
    dataConnection.on("close", () => {
      setConnRequestAccepted(false);
      setSelectedChat(null);
    });
  }


  useEffect(()=>{
    socket.current = io("https://websocketchatapp.tanujagupta.repl.co");
  return()=>{
    if(socket.current){
      socket.current.close();
    }
  }
  },[])

  const CustomToast = ({ name, peerId, user, connn }) => {
    userDetails.current = { ...user };
    entry1.current = true;
    // console.log('connn inside cutomtoast',connn)

    return (
      <div>
        <div style={{ margin: "5px" }}>{name} wants to connect with you.</div>
        <Button
          style={{
            margin: "0px 10px",
            color: "#651fff",
            borderColor: "#651fff",
          }}
          variant="outlined"
          onClick={() => {
            entry1.current = false;
            toast.dismiss();
           socket.current.emit("RejectConnection", {
              user: user,
              text: "Rejected your call",
            });
          }}
        >
          Reject
        </Button>
        <Button
          style={{ background: "#651fff" }}
          variant="contained"
          onClick={async () => {
            userDetails = {};
            entry1.current = false;
            if (connectRef.current) {
              await connectRef.current.close();
            }
            if (connn) {
              await connn.close();
            }
            connectPeer(peerId, user);
          }}
        >
          Accept
        </Button>
      </div>
    );
  };
  const CustomToast2 = ({ user }) => {
    return (
      <div>
        <div style={{ margin: "5px" }}> is video calling you.</div>
        <Button
          style={{
            margin: "0px 10px",
            color: "#651fff",
            borderColor: "#651fff",
          }}
          variant="outlined"
          onClick={() => {
            toast.dismiss();
           socket.current.emit("rejectVideoCall", {
              user: user,
              text: "Rejected your call",
            });
          }}
        >
          Reject
        </Button>
        <Button
          style={{ background: "#651fff" }}
          variant="contained"
          onClick={async () => {
           socket.current.emit("acceptedVideoCall", {
              user: user,
              text: "accepted your call",
            });
          }}
        >
          Accept
        </Button>
      </div>
    );
  };
  const notify = (name, peerId, user, connn) =>
    toast.success(
      <CustomToast name={name} peerId={peerId} user={user} connn={connn} />,
      {
        ...toastOptions,
        onClose: handleToastClose,
      }
    );
  const toastOptions = {
    position: "top-right",
    autoClose: "8000",
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  function check() {
    try {
      const userInfoUnparresed = localStorage.getItem("OnGraphTodoApp");
      if (userInfoUnparresed) {
        userInfo = JSON.parse(userInfoUnparresed);
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  check();

  async function selectChatFunction(user) {
    if (selectedChat !== null && connn) {
      await connn.close();
      setConnn(null);
    }
    setConnecting(true);
    setSelectedChat(user);
   socket.current.emit("selectUser", { ...user, peerId: peerId });
  }

  useEffect(() => {
    peer.on("open", function (id) {
      setPeerId(id);
    });
  }, []);

  // console.log("peerid is", peerId);
  useEffect(() => {
    // function handleConnection(conn) {
    //   console.log(conn);
    //   console.log(conn.peer);
    //   const otheruserId = conn.peer;
    //   alert(`${otheruserId} is trying to connect with you`);
    //   setConnRequestAccepted(true);

    //   conn.on("open", () => {
    //     alert("Data connection opened. You are now connected with1 " + peerId);
    //   });

    //   conn.on("data", (data) => {
    //     console.log(data);
    //   });

    //   sendFunc.current = (data1) => {
    //     conn.send(data1);
    //   }
    //   setConnn(conn);
    // }

    dataConnection1 = peer.on("connection", (conn) => {
      // console.log(conn);
      // console.log(conn.peer);
      const otheruserId = conn.peer;
      // alert(`${otheruserId} is trying to connect with you`);
      setConnRequestAccepted(true);
      conn.on("open", () => {
        // alert("Data connection opened. You are now connected with2 " + peerId);
        toast.success(
          `You are now connected with ${otheruserId}`,
          toastOptions
        );
        setConnecting(false);
      });
      // toast.success(`${otheruserId} is connected with you`)

      // conn.on("data", (data) => {
      //   console.log(data);
      // });

      sendFunc.current = (data1) => {
        conn.send(data1);
      };
      console.log(conn);
      setConnn(conn);
      connectRef.current = conn;
      conn.on("close", () => {
        setConnRequestAccepted(false);
        setSelectedChat(null);
      });
    });

    return () => {
      // Clean up the event listener when the component unmounts
      dataConnection1.off("connection", (conn) => {
        // console.log(conn);
        // console.log(conn.peer);
        const otheruserId = conn.peer;
        // alert(`${otheruserId} is trying to connect with you`);
        setConnRequestAccepted(true);
        conn.on("open", () => {
          // alert("Data connection opened. You are now connected with2 " + peerId);
          toast.success(`You are now connected with ${peerId}`);
          setConnecting(false);
        });
        // toast.success(`${otheruserId} is connected with you`)

        // conn.on("data", (data) => {
        //   console.log(data);
        // });

        sendFunc.current = (data1) => {
          conn.send(data1);
        };
        console.log(conn);
        setConnn(conn);
        connectRef.current = conn;
        conn.on("close", () => {
          setConnRequestAccepted(false);
          setSelectedChat(null);
        });
      });
    };
  }, []);

  useEffect(() => {
    check();
    return () => {
     socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    function connectFunc() {
      // console.log("Connected to the server");
     socket.current.emit("messageFromClient", {
        username: userInfo.username,
        email: userInfo.email,
      });
    }
    function newUserFunc(data) {
      // console.log("A new user arrived and his/her crediantials are : ", data);
      setOnlineUsers((prevUsers) => [...prevUsers, data]);
    }
    function userDisconnectedFunc(data) {
      // console.log("A user has disconnected, and their credentials are:", data);
      if (data && data.email) {
        setOnlineUsers((prevUsers) =>
          prevUsers.filter((user) => user.email !== data.email)
        );
      }
    }

    function connectedUserListFunc(data) {
      // console.log("list", data);
      setOnlineUsers(data);
    }

    function selectUserFunc(user) {
      // console.log(user)
      // alert(user.email)
      notify(user.username, user.peerId, user, connn);
    }

    function RejectConnectionMsgFunc(msg) {
      toast.error(msg, toastOptions);
      setConnecting(false);
    }

    function closeFunc() {
      // if(connectRef.current ){
      //   // connn.close();
      //   connectRef.current.close()
      // }
    }

    function recievingVideoCallFunc(user){
      toast.success(<CustomToast2 user={user}/>,toastOptions)
    }

    function recievingAnswerFromVideoCallFunc(data){
      if(data.accepted){
        navigate(`/chat2?email=${data.user.email}&senderEmail=${data.user.senderEmail}`)
      }else{
        toast.error("Rejected your video call",toastOptions)
      }
    }

    function sendingPeerIdFunc(data){
      navigate(`/chat2?peerId=${data.peerId}`)
   }

   socket.current.on("connect", connectFunc);
   socket.current.on("newUser", newUserFunc);
   socket.current.on("userDisconnected", userDisconnectedFunc);
   socket.current.on("connectedUsersList", connectedUserListFunc);
   socket.current.on("selectedUser", closeFunc);
   socket.current.on("selectedUser", selectUserFunc);
   socket.current.on("RejectConnectionMsg", RejectConnectionMsgFunc);
   socket.current.on("recievingVideoCall", recievingVideoCallFunc);
   socket.current.on("recievingAnswerFromVideoCall", recievingAnswerFromVideoCallFunc);
   socket.current.on('recievingPeerId',sendingPeerIdFunc)
    return () => {
     socket.current.off("connect", connectFunc);
     socket.current.off("newUser", newUserFunc);
     socket.current.off("userDisconnected", userDisconnectedFunc);
     socket.current.off("connectedUsersList", connectedUserListFunc);
     socket.current.off("selectedUser", closeFunc);
     socket.current.off("selectedUser", selectUserFunc);
     socket.current.off("RejectConnectionMsg", RejectConnectionMsgFunc);
     socket.current.off("recievingVideoCall", recievingVideoCallFunc);
     socket.current.off("recievingAnswerFromVideoCall", recievingAnswerFromVideoCallFunc);
     socket.current.off('recievingPeerId',sendingPeerIdFunc)
    };
  }, []);
  return (
    <>
      {connecting ? (
        <div
          style={{
            opacity: "0.8",
            position: "absolute",
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "121212",
            background: "black",
          }}
        >
          <img src={callingGif} alt="2323" width={"100%"} />
        </div>
      ) : (
        <></>
      )}
      <Cont>
        <Container>
          <div id="onlineUsers123">
            <div id="divh2">
              <img
                id="img1"
                src="https://64c001d4ad4d710850d7fb62--rad-brigadeiros-491294.netlify.app/static/media/logo.ccfbd90732828204fa6989c0f15638c0.svg"
                alt="img"
              />
              <h2 id="h2">Online users</h2>
            </div>
            {onlineUsers.map((user) => {
              return (
                <div
                  key={user.email}
                  className="user123456"
                  onClick={() => {
                    selectChatFunction({
                      ...user,
                      senderEmail: userInfo.email,
                    });
                  }}
                >
                  <p>{user.username}</p>
                </div>
              );
            })}
          </div>
          <div id="chats123" style={{ position: "relative" }}>
            {selectedChat && connRequestAccepted ? (
              <>
                <ChatComponent
                  sendFunc={sendFunc.current}
                  connn={connn}
                  setConnn={setConnn}
                  peer={peer}
                  peerId={peerId}
                  selectedChat={selectedChat}
                  userInfo={userInfo}
                />
              </>
            ) : (
              <>
                <img
                  src="https://64c001d4ad4d710850d7fb62--rad-brigadeiros-491294.netlify.app/static/media/robot.0617a41936621e9697cd.gif"
                  alt="img2sad"
                  id="gifImage"
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0rem",
                  }}
                >
                  <p className="welcome">
                    Welcome <span>{userInfo?.username}</span>
                  </p>
                  <p className="welcome">
                    please select a chat to start messaging
                  </p>
                </div>
              </>
            )}
          </div>
        </Container>
        <ToastContainer />
      </Cont>
    </>
  );
}

const ChatComponent = ({ sendFunc, connn, setConnn,peer, peerId ,selectedChat,userInfo}) => {
  const socket = useRef(null);
  const [inputVal, setInputval] = useState("");
  const [chats, setChats] = useState([]);
  const chatContRef = useRef(null);
  const live = useRef(null);
  const remoteVideo = useRef(null);
  const localVideo = useRef(null);
  const currentCall = useRef(null);
  const navigate = useNavigate();
  const labelStyles = {
    color: "white",
  };
  const buttonStyle = {
    width: "10%",
    height: "55px",
  };
  // console.log(connn)

  useEffect(()=>{
  socket.current = io("https://websocketchatapp.tanujagupta.repl.co");
  return()=>{
    if(socket.current){
      socket.current.close();
    }
  }
  },[])

  useEffect(() => {
    const onDataReceived = (data) => {
      const currentTime = new Date().toLocaleTimeString();
      const newChat = { mezType: "recieved", text: data, time: currentTime };
      setChats((prevChats) => [...prevChats, newChat]);
      chatContRef.current.scrollTop = chatContRef.current.scrollHeight;
    };
    // const closeListeningFunction = () => {
    //   alert('Data connection is closed by User');
    // }

    connn.on("data", onDataReceived);
    // connn.on('close', closeListeningFunction);

    return async () => {
      await connn.close();
      setConnn(null);
      connn.off("data", onDataReceived);
      // connn.off("close",closeListeningFunction)
    };
  }, []);
  useEffect(() => {
    chatContRef.current.scrollTop = chatContRef.current.scrollHeight;
  }, [chats]);
  // console.log(chats);
  useEffect(() => {
    //  console.log('connn changed' , connn);
    setChats([]);
  }, [connn]);
  console.log(selectedChat,'sssssss')
  return (
    <div
      style={{
        position: "absolute",
        bottom: "10px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
      }}
    >
      <div id="chatBox">
        <div id="chatCont" ref={chatContRef}>
          <div id="live" ref={live} style={{display:"none"}}>
            <video id="remote-video" ref={remoteVideo} autoplay></video>
            <video id="local-video" ref={localVideo} muted="true" autoplay></video>
            <Button id="end-call" variant="contained" >End Call</Button>
          </div>
          <div
            style={{
              width: "100px",
              position: "absolute",
              top: "20px",
              right: "0px",
              zIndex: "121212",
            }}
          >
            <Button
              style={{ background: "#651fff" }}
              variant="contained"
              onClick={async () => {
                await connn.close();
              }}
            >
              <Tooltip title="Close">
                <CloseIcon />
              </Tooltip>
            </Button>
          </div>
          <div
            style={{
              width: "100px",
              position: "absolute",
              top: "20px",
              right: "80px",
              zIndex: "121212",
            }}
          >
            <Button
              style={{ background: "#651fff" }}
              variant="contained"
              onClick={()=>{ 
                const requiredEmail = selectedChat.email===userInfo.email ? selectedChat.senderEmail : selectedChat.email
                const requiredSenderEmail = selectedChat.email===userInfo.email ? selectedChat.email : selectedChat.senderEmail 
               socket.current.emit('initiatingVideoCall',{email:requiredEmail,senderEmail:requiredSenderEmail})
                // navigate(`/chat2?email=${selectedChat.email}&senderEmail=${selectedChat.senderEmail}`);
              }}
            >
              <Tooltip title="Video Call">
                <VideoCallIcon />
              </Tooltip>
            </Button>
          </div>
          {chats.map((chat) => {
            return (
              <div
                id="chatDiv"
                key={chat.time + chat.text}
                className={
                  chat.mezType === "recieved" ? "recievedMsg" : "sentMsg"
                }
              >
                <p
                  className={
                    chat.mezType === "recieved"
                      ? "recievedMsgTime"
                      : "sentMsgTime"
                  }
                >
                  {chat.text}
                </p>
                <p id="chatTime">{chat.time}</p>
              </div>
            );
          })}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CustomTextField
          id="outlined-basic"
          placeholder="Type your mez here"
          variant="outlined"
          InputLabelProps={{ style: labelStyles }}
          value={inputVal}
          onChange={(e) => {
            setInputval(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const currentTime = new Date().toLocaleTimeString();
              const newChat = {
                mezType: "sent",
                text: inputVal,
                time: currentTime,
              };
              setChats((prevChats) => [...prevChats, newChat]);
              sendFunc(inputVal);
              setInputval("");
              chatContRef.current.scrollTop = chatContRef.current.scrollHeight;
            }
          }}
        />
        {true ? (
          <Button
            variant="contained"
            style={buttonStyle}
            onClick={() => {
              const currentTime = new Date().toLocaleTimeString();
              const newChat = {
                mezType: "sent",
                text: inputVal,
                time: currentTime,
              };
              setChats((prevChats) => [...prevChats, newChat]);
              sendFunc(inputVal);
              setInputval("");
              chatContRef.current.scrollTop = chatContRef.current.scrollHeight;
            }}
          >
            Send
          </Button>
        ) : (
          <Button variant="contained" style={buttonStyle} onClick={() => {}}>
            Send
          </Button>
        )}
      </div>
    </div>
  );
};

const Cont = styled.div`
  .Toastify__progress-bar {
    background: #651fff;
  }
  .Toastify__toast-body svg {
    fill: #00ff00;
  }
`;
const Container = styled.div`
  display: flex;
  flex-direction: row;
  #onlineUsers123 {
    width: 30%;
    height: 100vh;
    background-color: rgb(8, 4, 32);
    display: flex;
    flex-direction: column;
    #divh2 {
      display: flex;
      width: 100%;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      #img1 {
        width: 30px;
        transition: 0.8s ease;
        animation: animate2 0.8s ease forwards;
      }
      @keyframes animate2 {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(180deg);
        }
      }
    }
    #h2 {
      color: white;
    }
    .user123456 {
      margin: 10px 10px;
      background-color: #291f42;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      transition: 0.5s ease;
      user-select: none;
      min-height: 40px;
      border-radius: 2px;
      p {
        width: 100%;
        height: 20px;
        color: #ffffff;
        text-align: center;
        padding: 0;
      }
      &:hover {
        background-color: #452d82;
      }
      &:active {
        transform: scale(0.95);
      }
    }
  }
  #chats123 {
    width: 70%;
    height: 100vh;
    background-color: #291f42;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    min-height: 60px;
    #gifImage {
      width: 40%;
    }
    .welcome {
      color: white;
      font-size: 24px;
      font-weight: 500;
      margin: 0;
      padding: 0;
      span {
        color: #4e0eed;
      }
    }
  }
  #chatBox {
    width: 100%;
    height: 90%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  #chatCont {
    width: 95%;
    height: 80%;
    background-color: #3e355c;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    padding-top: 100px;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        height: 1rem;
        background-color: rgba(255, 255, 255, 0.6);
      }
    }
    .recievedMsg {
      background-color: #42a5f5;
      width: 40%;
      word-break: break-all;
      padding: 2px 1px;
      text-align: center;
      border-radius: 0.5rem;
      margin-left: 58%;
      position: relative;
      color: white;
      font-weight: 500;
      min-height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    #recievedMsgTime {
      color: #040404;
    }
    .sentMsg {
      position: relative;
      text-align: center;
      word-break: break-all;
      margin-left: 2%;
      width: 40%;
      background-color: #838ee2;
      padding: 2px 1px;
      border-radius: 0.5rem;
      color: white;
      font-weight: 500;
      min-height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    #chatTime {
      position: absolute;
      bottom: 0px;
      right: 2px;
      font-size: 12px;
      color: #000000;
    }
  }
`;

const CustomTextField = styled(TextField)`
  /* background-color: #838ee2; */
  background-color: white;
  border: 2px solid green;
  border-radius: 5px;
  padding: 10px;
  width: 85%;
`;
