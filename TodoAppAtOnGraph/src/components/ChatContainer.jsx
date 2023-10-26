import React, { useEffect, useReducer, useRef, useState,useLayoutEffect, Fragment } from 'react'
import styled from 'styled-components'
import Typography from '@mui/material/Typography';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import url1 from '../urls/url';
import io from "socket.io-client";
import { ModalComponenet } from './UserLists';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import Tooltip from "@mui/material/Tooltip";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import axios from 'axios';
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ContentCut from "@mui/icons-material/ContentCut";
import ContentCopy from "@mui/icons-material/ContentCopy";
import ContentPaste from "@mui/icons-material/ContentPaste";
import UndoIcon from "@mui/icons-material/Undo";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded';
import DoneTwoToneIcon from '@mui/icons-material/DoneTwoTone';
import HourglassFullTwoToneIcon from '@mui/icons-material/HourglassFullTwoTone';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CircularProgress from '@mui/material/CircularProgress';
import FavoriteIcon from '@mui/icons-material/Favorite';

export default function ChatContainer({selectedUser=null,selectingUserFunc,updatingObjFunc}) {
  let userInfo;
  const userInfoUnparresed = localStorage.getItem("OnGraphTodoApp");
  if (userInfoUnparresed) {
    userInfo = JSON.parse(userInfoUnparresed);
  } 
  return (
    <ConainerForChats>
     {
        selectedUser!==null ? (<ChatsBetweenuser selectedUser={selectedUser} selectingUserFunc={selectingUserFunc} updatingObjFunc={updatingObjFunc}/>) : (<DefaultChatScreen/>)
     }
    </ConainerForChats>
  )
}

const ConainerForChats = styled.div`
      width: 100%;
      height: 100%;
    background-color: #291f42;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const DefaultChatScreen = ()=>{
    let userInfo;
    const userInfoUnparresed = localStorage.getItem("OnGraphTodoApp");
    if (userInfoUnparresed) {
      userInfo = JSON.parse(userInfoUnparresed);
    } 
    return(
      <>
        <img src="https://64c001d4ad4d710850d7fb62--rad-brigadeiros-491294.netlify.app/static/media/robot.0617a41936621e9697cd.gif" alt="img2sad" id="gifImage"/>
        <div style={{display: "flex",flexDirection: "column",gap: "0rem"}}>
          <Typography sx={{color:"#4121d1"}} variant="h4">Welcome <span style={{color:'white'}}>{userInfo?.username}</span></Typography>
          <Typography sx={{color:"#4121d1"}} variant="h5">please select a chat to start messaging</Typography>
        </div>
      </>
    )
}


const labelStyles = {
  color: "white",
};
const buttonStyle = {
  width: "10%",
  height: "55px",
};

const ChatsBetweenuser = ({selectedUser,selectingUserFunc,updatingObjFunc})=>{
  let userInfo;
  const imageDataObjFromLocalStorage = localStorage.getItem("profileImageAvatar");
  const imageDataObj = JSON.parse(imageDataObjFromLocalStorage);
  const imageData = imageDataObj.imageData;
  const userInfoUnparresed = localStorage.getItem("OnGraphTodoApp");
  if (userInfoUnparresed) {
    userInfo = JSON.parse(userInfoUnparresed);
  } 
  const socket = useRef(null);
  const [inputVal,setInputval] = useState('Hy');
  const [chats,setChats] = useState([]);
  const [selectedImageFromGallery,setSelectedImageFromGallery] = useState(null);
  const [selectedImageUrl,setSelectedImageUrl] = useState(null);
  const [isUserOnline,setIsUserOnline] = useState(false);
  const [count1, setCount1] = useState(0);
  const timeOut = useRef(null);
  const chatsRef = useRef([]);
  const responseCame = useRef(false);
  const middleChatSectioNRef = useRef(null);
  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const uploadImageRef = useRef(null);
  const uploadImageDivRef = useRef(null);
  const sendButtonRef = useRef(null);
  const inputElement = useRef(null);

  // console.log(chats)
  useEffect(()=>{
   socket.current =  io(url1);
   console.log(socket.current);
   inputElement.current.focus()
   return()=>{
    setInputval("")
   }
  },[selectedUser])

  function sendMez(){
    const now = new Date();
    const isoString = now.toISOString();
    setInputval("");
    let sendingData = {senderEmail:userInfo.email,recieverEmail:selectedUser.email,mez:inputVal,type:'text',recieverUsername:selectedUser.username,type2:'receving',time:isoString};
    socket.current.emit("mezRecievingAtBackendAndSendingFromFrontend",sendingData);
    setChats((prevChats) => [...prevChats, {...sendingData,type2:"sent"}]);
    chatsRef.current = [...chatsRef.current, {...sendingData,type2:"sent"}];
    setCount1(count1+1);
    updatingObjFunc(selectedUser.email,{...sendingData,text:sendingData.mez});
  }

  const openFileInput = () => {
    fileInputRef.current.click();
  };

  async function uploadChatImageOrVideoFromgallery(){
    console.log('23232323232323')
    if (selectedImageFromGallery) {
      try {
        const formData = new FormData();
        formData.append('image', selectedImageFromGallery);
        formData.append('senderEmail', userInfo.email);
        formData.append('recieverEmail', selectedUser.email);
        formData.append('type', 'image');
        formData.append('type2', 'receving');
        const response = await axios.post(`${url1}/chatImageVideoUploaded`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log('File uploaded successfully:', response.data);
        if(response.data.status===201){
          // toast.success("Profile Image updated",toastOptions);
          console.log(response);
          setSelectedImageFromGallery(null);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  }

  function videoCallingFunc(){
    const url = "http://localhost:3000";
    const width = window.innerWidth / 2;
    const height = window.innerHeight / 2;
    window.open(url, '_blank', `width=${width},height=${height}`);
  }

  function focusInput(){
    if (inputElement.current) {
      inputElement.current.focus();
    }
  };
   focusInput()
  const handleFileSelection = async (event) => {
    const selectedFile = event.target.files[0];
     setSelectedImageFromGallery(event.target.files[0]);
     if (selectedFile) {
      const reader = new FileReader();
  
      reader.onload = (e) => {
        setSelectedImageUrl(e.target.result);
        uploadImageRef.current.src = e.target.result;
        uploadImageDivRef.current.style.display='block'
        sendButtonRef.current.focus();
      }; 
  
      reader.readAsDataURL(selectedFile);
    }
  };

  async function sendImageOrVideoFunc(){
    await uploadChatImageOrVideoFromgallery()
    const now = new Date();
    const isoString = now.toISOString();
    let sendingDataOfImageOrVideo = {senderEmail:userInfo.email,recieverEmail:selectedUser.email,text:selectedImageUrl,type:'image',recieverUsername:selectedUser.username,type2:'receving',time:isoString};
    socket.current.emit("imageOrVideo", sendingDataOfImageOrVideo);
    setChats((prevChats) => [...prevChats, {...sendingDataOfImageOrVideo,type2:"sent"}]);
    chats.current = [...chatsRef.current,{...sendingDataOfImageOrVideo,type2:"sent"}];
  }

  useEffect(()=>{
    async function func(){
      const savedChatsFromDB = await axios.post(`${url1}/getAllMessages`,{email:selectedUser.email,email2:userInfo.email});
      console.log(savedChatsFromDB.data.messages);
      setTimeout(()=>{
        setChats(savedChatsFromDB.data.messages);
        chatsRef.current = savedChatsFromDB.data.messages;
        setCount1(count1+1);
        responseCame.current = true;
      },600);
    }
    func();
    return ()=>{
      responseCame.current = false;
    }
  },[selectedUser])

  useEffect(()=>{
   setTimeout(()=>{
    socket.current.emit('IsUserOnline',{recieverEmail:selectedUser.email,senderEmail:userInfo.email})
   },600)
  },[selectedUser])

  useEffect(()=>{
    function connectFunc() {
      socket.current.emit("initiatingSocket", {senderEmail:userInfo.email,recieverEmail:selectedUser.email});
    }

    function recievingMezFunc(data){
      const now = new Date();
      const isoString = now.toISOString();
     if(data.senderEmail===selectedUser.email){
      setChats((prevChats) => [...prevChats, data]);
      chatsRef.current = [...chatsRef.current,data];
      socket.current.emit('seenMez',{seenerEmail:userInfo.email,senderEmail:selectedUser.email});
      updatingObjFunc(data.senderEmail,{...data,text:data.mez,time:isoString});
     }else{
      updatingObjFunc(data.senderEmail,{...data,text:data.mez,time:isoString});
     }
    }

    function receivingImageOrVideoFunc(data){
      console.log('recieved image')
      // uploadImageRef.current.src = data.data;
      // uploadImageDivRef.current.style.display='block'
      setChats((prevChats) => [...prevChats, data]);
      chatsRef.current = [...chatsRef.current,data];
    }

    function updatedChatsFunc(updatedChats){
      // console.log('yes chats arrived',updatedChats)  
      setTimeout(()=>{
        async function func(){
          // const savedChatsFromDB = await axios.post(`${url1}/getAllMessages`,{email:selectedUser.email,email2:userInfo.email});
          // console.log(savedChatsFromDB.data.messages);
          // setChats(savedChatsFromDB.data.messages);
          // chatsRef.current = savedChatsFromDB.data.messages;

          const filteredMessages = updatedChats.messages?.filter((mez)=>{
            return (mez.sender===selectedUser.email || mez.receiver===selectedUser.email);
           })
          // filteredMessages[filteredMessages.length-1].isSent = true
         setChats(filteredMessages);
         chatsRef.current = filteredMessages;
        }
        func();
      },800)
    }

    async function deleteMezForALlEventHappenedFunc(){
      const savedChatsFromDB = await axios.post(`${url1}/getAllMessages`,{email:selectedUser.email,email2:userInfo.email});
      console.log('savedChats',savedChatsFromDB.data.messages);
      setChats(savedChatsFromDB.data.messages);
      chatsRef.current = savedChatsFromDB.data.messages;
    }

    function userOnineCheckingFunction(){
      setIsUserOnline(true)
    }

    function userGoesOfflineFunc(data){
      if(data.email===selectedUser.email){
        setIsUserOnline(false)
      }
    }

    function userComesOnlineFUnction(data){
       if(data.email === selectedUser.email){
        setIsUserOnline(true);
       }
    }
    
    async function userMezSeenFunc(updatedMessages2){
      const filteredMessages = updatedMessages2.messages?.filter((mez)=>{
        return (mez.sender===selectedUser.email || mez.receiver===selectedUser.email);
       })
      // console.log('filtered Mez',filteredMessages);
      // const filteredMessages2 = [...chats,filteredMessages[filteredMessages?.length-1]];
        // if(filteredMessages2!==undefined){
          // setChats(prevChats=>filteredMessages2);
        // }
      // deleteMezForALlEventHappenedFunc();
      console.log('filtered Messages',filteredMessages)
      if(filteredMessages!==undefined){
        setChats(prevChats=>filteredMessages);
        chatsRef.current = filteredMessages;
      }
    }
    async function userMezSeenFunc1(updatedMessages2){
      deleteMezForALlEventHappenedFunc();
    }

    function recievedLikedFunc(data){
      if(data.senderEmail===selectedUser.email){
        const newChats = chatsRef.current.map((chat)=>{
          if(chat.uniqueId===data.uniqueId){
           return {...chat,isLiked:true}
          }
          else{
            return chat;
          }
        })
        setChats(prevChats=> newChats);
        chatsRef.current = newChats;
      }
    }    

    function likeSentFunc(data){
      if(data.uniqueId){
        const newChats = chatsRef.current.map((chat)=>{
          if(chat.uniqueId===data.uniqueId){
           return {...chat,isLiked:true}
          }
          else{
            return chat;
          }
        })
        setChats(prevChats=> newChats);
        chatsRef.current = newChats;
      }
    }

    socket.current.on("connect", connectFunc);
    socket.current.on("recievingdataFromBackendAtFronend", recievingMezFunc);
    socket.current.on("receivedImageOrVideo",receivingImageOrVideoFunc);
    socket.current.on("updatedChats",updatedChatsFunc);
    socket.current.on("deleteMezForALlEventHappened",deleteMezForALlEventHappenedFunc);
    socket.current.on("userOnline",userOnineCheckingFunction);
    socket.current.on("userGoesOffline",userGoesOfflineFunc);
    socket.current.on("userComesOnline",userComesOnlineFUnction);
    socket.current.on("userMezSeen",userMezSeenFunc);
    socket.current.on("userMezSeen1",userMezSeenFunc1);
    socket.current.on("recievedLiked",recievedLikedFunc);
    socket.current.on("likeSent",likeSentFunc);
    inputElement.current.focus();
    return () => {
      socket.current.off("connect", connectFunc);
      socket.current.off("recievingdataFromBackendAtFronend", recievingMezFunc);
      socket.current.off("receivedImageOrVideo",receivingImageOrVideoFunc);
      socket.current.off("updatedChats",updatedChatsFunc);
      socket.current.off("deleteMezForALlEventHappened",deleteMezForALlEventHappenedFunc);
      socket.current.off("userOnline",userOnineCheckingFunction);
      socket.current.off("userGoesOffline",userGoesOfflineFunc);
      socket.current.off("userComesOnline",userComesOnlineFUnction);
      socket.current.off("userMezSeen",userMezSeenFunc);
      socket.current.off("userMezSeen1",userMezSeenFunc1);
      socket.current.off("recievedLiked",recievedLikedFunc);
      socket.current.off("likeSent",likeSentFunc);
      setIsUserOnline(false);
    };
  },[selectedUser])

  useEffect(() => {
    return () => {
      // socket.current.close();
      socket.current.disconnect() 
      setChats(prevChats => [])
      chatsRef.current = [];
    };
  }, [selectedUser]);
  // console.log(selectedUser,'selecrtedUser')

  useEffect(()=>{
    middleChatSectioNRef.current.scrollTop = middleChatSectioNRef.current.scrollHeight;
  },[count1,selectedUser])
  return(
    <ChatsSectionForUsers ref={chatContainerRef}>
       {
        !responseCame.current && 
        <div style={{position:'absolute',zIndex:'12222',top:"45%",left:"calc(50% - 10px)"}}>
        <CircularProgress />
        </div> 
       }
       {
        (chats?.length===0 && responseCame.current) &&     
        <div style={{position:'absolute',zIndex:'12222',top:"50%",left:"calc(50% - 100px)",color:"white",fontSize:"30px"}}>
          No chats avaliable
        </div>
       }
      <div id='aboveOtherUserLabel'>
      <div id='closeButtonDiv1' onClick={()=>{selectingUserFunc(null)}}>
      <Tooltip title="Go Back">
        <KeyboardBackspaceIcon sx={{color:'white',fontSize:"32px"}}/>
      </Tooltip>
      </div>
      <ModalComponenet avatar={selectedUser.avatar!==''?selectedUser.avatar:'uploads/default-avatar-profile-icon-of-social-media-user-vector.jpg'} imgClassName='otherUserAvatar' usernameText={selectedUser.username} aniamtion={true} selectedUser={selectedUser}/>
      <Typography variant="h6" gutterBottom sx={{color:'white',margin:'0'}}>{selectedUser.username}</Typography>
      {
        isUserOnline ? <Typography variant="body1" gutterBottom  sx={{color:'white',margin:'0',backgroundColor:"#1cb41c",padding:"0px 6px",borderRadius:"12px"}}>Online</Typography> : 
        <Typography variant="body1" gutterBottom  sx={{color:'white',margin:'0',backgroundColor:"#fb3a3a",padding:"0px 6px",borderRadius:"12px"}}>Offline</Typography>
      }
      <div id='VideoCallingDiv'>
      <Tooltip title="VideoCall">
        <VideoCallIcon sx={{color:'white',fontSize:"32px"}}/>
      </Tooltip>
        </div>
      </div>

      <div id='MiddleChatSection' ref={middleChatSectioNRef}>
         {
          chats?.map((chat)=>{
            return(
              <div key={chat.uniqueId?chat.uniqueId:chat.time}>
             <TextComponent  chat={chat} selectedUser={selectedUser} chatContainerRef={chatContainerRef.current} socket={socket.current} userInfo={userInfo}/>
              </div>
            )
          })
         }
      </div>

      <div id='inputFieldForText'>
      <CustomTextField
          ref={inputElement}
          autoFocus
          id="outlined-basic"
          placeholder="Type your mez here"
          variant="outlined"
          InputLabelProps={{ style: labelStyles }}
          value={inputVal}
          type='text'
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          onChange={(e) => {
            setInputval(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMez();
            }
          }}
        />
         <div id='uploadIcon' onClick={openFileInput}>
         <Tooltip title="Upload image/video">
         <UploadFileRoundedIcon sx={{color:"white",fontSize:"50px"}}/>
         </Tooltip>
         </div>
         <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileSelection}
      />
          <Button variant="contained" style={buttonStyle}
            onClick={() => {
              if(selectedImageUrl!==null){
                sendImageOrVideoFunc();
                setSelectedImageUrl(null);
                setSelectedImageFromGallery(null);
                uploadImageRef.current.src = null;
                uploadImageDivRef.current.style.display='none'
              }else{
                sendMez();
              }
            }} ref={sendButtonRef}>Send</Button>
      </div>
      <div style={{position:'absolute',bottom:"8%",right:"6%",display:'none',width:"20%"}} ref={uploadImageDivRef}>
      <img src="" alt="" width={'100%'} ref={uploadImageRef}/>
      </div>
      <ContextMenu refrenceOfP={chatContainerRef} setChats={setChats} chatsRef={chatsRef.current} selectedUser={selectedUser} socket={socket.current}/>
    </ChatsSectionForUsers>
  )
}
const CustomTextField = styled(TextField)`
  background-color: white;
  border: 2px solid green;
  border-radius: 5px;
  width: 100%;
`;

const ChatsSectionForUsers = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  #inputFieldForText{
    width: 98.1%;
    position: absolute;
    bottom: 10px;
    padding: 0px 10px;
    display: flex;
    flex-direction: row;
    gap: 0.2rem;
    z-index: 10;
    #uploadIcon{
      transition: 0.5s ease;
      cursor: pointer;
      &:active{
        transform: scale(0.8);
      }
    }
  }
  #aboveOtherUserLabel{
    max-width: 100%;
    height: 50px;
    background-color: #6445ca;
    margin: 10px 10px;
    border-radius: 5px;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    padding: 0px 20px;
    position: relative;
    z-index: 10;
  } 
  .otherUserAvatar{
    width: 40px;
    border-radius: 120px;
    @media screen and (max-width: 600px){
            width: 30px;
    }
  }
  #VideoCallingDiv{
    position: absolute;
    right: 10px;
    cursor: pointer;
    transition: 0.3s ease;
    &:active{
      transform: scale(0.9);
    }
  }
  #MiddleChatSection{
    position: absolute;
    background-color: rgb(1, 0, 8);
    width: calc(100% - 20px);
    height: 89.8%;
    /* height: 120%; */
    /* bottom: 80px; */
    top: 0;
    left: 0;
    border-bottom: 5px solid white;
    margin: 0px 10px;
    overflow: auto;
    padding-top: 100px;
    .imageFromOtherUser{
      width: 100%;
    }
    &::-webkit-scrollbar {
      width: 0.3rem;
      height: 0.1rem;
      &-thumb {
        background-color: white;
        width: 0rem;
        border-radius: 1em;
      }
    }
  }
  #closeButtonDiv1{
    cursor: pointer;
  }
 @keyframes animateLoadingbar12345 {
    0%{
      transform: rotate(0deg);
    }
    100%{
      transform: rotate(180deg);
    }
 }
`

const TimeComponent = ({time,chat})=>{

  const utcDateString = `${time}`;
  const utcDate = new Date(utcDateString);

  // Set the time zone to Indian Standard Time (IST)
  const istTimezone = "Asia/Kolkata";

  // Options for formatting the date and time in IST
  const istOptions = {
    timeZone: istTimezone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true, // Use 12-hour format with AM/PM
  };
  const istOptions2 = {
    timeZone: istTimezone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true, // Use 12-hour format with AM/PM
  };

  // Convert the UTC date to IST
  const istDate = utcDate.toLocaleString("en-IN", istOptions);
  const istDate2 = utcDate.toLocaleString("en-IN", istOptions2);
   return(
    <>
        <Tooltip title={istDate}>
       <Typography sx={{color:"#000000",fontSize:"10px", position:'absolute',bottom:"-3px",right:`${chat.type2==='sent'?"":"3%"}`,left:`${chat.type2==='sent'?"3%":""}`}} variant="body2">{istDate2}</Typography>
        </Tooltip>
    </> 
  )
}

const TextComponent = ({chat,selectedUser,count,chatContainerRef,socket,userInfo})=>{
  const refrenceOfChatTag = useRef(null);
  let backgroundColorOfChatText 
  if(chat.type2==='sent' && !chat.isDeleted){
    backgroundColorOfChatText='#6445ca'
  }else if(chat.isDeleted && chat.isDeleted){
    backgroundColorOfChatText='#5b5964'
  }else{
    backgroundColorOfChatText = '#dc0c0c'
  }
  return(
    <>
     <div style={{position:"relative"}} ref={refrenceOfChatTag} onDoubleClick={()=>{    
      if(chat.type2==='receving'){
                socket.emit("likedMessage",{senderEmail:userInfo.email,recieverEmail:selectedUser.email,uniqueId:chat.uniqueId})
             }}}>
                {
                  chat.type==='text' 
                  &&
               <Typography  id={chat._id?chat.uniqueId:Math.random()*1000} className={`abcd ${chat.type2==='sent'?'':"sentMez"}`} sx={{cursor:'pointer',position:'relative',padding:'5px',minHeight:"35px",color:"white",wordBreak:"break-all",width:"40%",backgroundColor:`${backgroundColorOfChatText}`,borderRadius:"4px",textAlign:"center",marginLeft:`${chat.type2==='sent'?"58%":"2%"}`,userSelect:"none"}} variant="body1" gutterBottom>{chat.mez?chat.mez:chat.text}
               <TimeComponent time={chat.time} chat={chat}/>
              {
                !chat._id ?  <HourglassFullTwoToneIcon sx={{position:'absolute',right:"0.5%",bottom:"0px",fontSize:"15px",animation:"animateLoadingbar12345 1s ease infinite",transition:"1s ease",display:`${chat.type2==='sent'?"block":'none'}`}}/> 
                :
               (
                (()=>{
                  if(chat?.isMezRead){
                    return(
                      <DoneAllIcon sx={{position:'absolute',right:"0.5%",bottom:"0px",fontSize:"15px",display:`${chat.type2==='sent'?"block":'none'}`,borderRadius:"50%",color:"#03fd03",fontWeight:"900",}}/>
                    )
                  }else if(chat?.isSent){
                   return(
                    <DoneAllIcon sx={{position:'absolute',right:"0.5%",bottom:"0px",fontSize:"15px",display:`${chat.type2==='sent'?"block":'none'}`,border:"1px solid black",borderRadius:"50%",color:"black",backgroundColor:'white',fontWeight:"900",}}/>
                   )
                  } else{
                   return(
                    <DoneTwoToneIcon  sx={{position:'absolute',right:"0.5%",bottom:"0px",fontSize:"15px",display:`${chat.type2==='sent'?"block":'none'}`,border:"1px solid black",borderRadius:"50%",color:"black",backgroundColor:'white',fontWeight:"900",}}/>
                   )
                  }
                })()
               )
                
              }
               </Typography> 
                }
                {
                  chat.type==='image'
                  &&
                  <div style={{width:"100%",margin:"1rem 0px"}}>
                     <div style={{marginLeft:`${chat.type2==='sent'?"58%":"2%"}`,width:"30%"}}>
                     <ModalComponenet avatar={chat.text} imgClassName='imageFromOtherUser' usernameText={selectedUser.username} selectedUser={selectedUser} type='image'/>
                     </div>
                  </div>
                }
             {
              chat.isLiked &&
              <div style={{position:'absolute',marginLeft:`${chat.type2==='sent'?"58%":"2%"}`,zIndex:"1234",bottom:"-20px"}}>
                <FavoriteIcon sx={{color:`${chat.type2==='sent'?"red":"#6901fa"}`}}/>
              </div>
             }
              </div>
    </>
  )
}

const ContextMenu = ({refrenceOfP,setChats,selectedUser,socket,chatsRef}) => {
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [showDeleteForEveryOne,setShowDeleteForEveryOne] = useState(true);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    top: 0,
    left: 0,
  });
  const chatId = useRef(null);
  const userInfo = useRef(null);
  const userInfoUnparresed = localStorage.getItem("OnGraphTodoApp");
  if (userInfoUnparresed) {
    userInfo.current = JSON.parse(userInfoUnparresed);
  } 
 const innerText = useRef('')
  function copyTextToClipboard() {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(innerText.current)
        .then(() => {
          console.log("Text copied to clipboard:", innerText.current);
        })
        .catch((err) => {
          console.error("Unable to copy text to clipboard:", err);
        });
    } else {
      console.error("Clipboard API not supported in this browser.");
    }
  }

  const handleContextMenu = (e) => {

     let aa = e.target;
    const str = aa.className;
    const id = aa.id;
    chatId.current = id;
    if (typeof str === 'string' && str.includes("abcd")) {
     console.log("The string contains 'abcd'.");
     e.preventDefault(); // Prevent the default context menu
     e.stopPropagation();
     setContextMenuPosition({ top: e.clientY, left: e.clientX });
     setContextMenuVisible(true);
     let inner = aa.innerHTML
     innerText.current = inner.split("<")[0]; 
     if(str.includes("sentMez")){
      setShowDeleteForEveryOne(false);

     }else{
      setShowDeleteForEveryOne(true)
     }
    } else {
     console.log("The string does not contain 'abcd'.");
    }
  };
  
  const handleCloseContextMenu = () => {
    setContextMenuVisible(false);
  };

  const handleMenuItemClick = () => {
    copyTextToClipboard('121212');
    handleCloseContextMenu();
  };

  async function deleteforEveryOneFunc(id,senderEmail,recieverEmail){
    const deleteMezRequest = await axios.post(`${url1}/deleteMezForEverOne`,{id,senderEmail,recieverEmail})
    console.log(deleteMezRequest);
    // setChats(deleteMezRequest.data.messages);
    if(deleteMezRequest.status===200){
      async function func(){
        const savedChatsFromDB = await axios.post(`${url1}/getAllMessages`,{email:selectedUser.email,email2:userInfo.current.email});
        console.log(savedChatsFromDB.data.messages);
        setChats(savedChatsFromDB.data.messages);
        chatsRef = savedChatsFromDB.data.messages;
      }
      func();
      socket.emit('deleteMezForALl',{recieverEmail:selectedUser.email});
    }
  }

  async function delteForYouFunc(id,email){
   const deleteMezRequest = await axios.post(`${url1}/deleteMezForMe`,{id,email})
   console.log(deleteMezRequest);
  //  setChats(deleteMezRequest.data.messages)
  async function func(){
    const savedChatsFromDB = await axios.post(`${url1}/getAllMessages`,{email:selectedUser.email,email2:userInfo.current.email});
    console.log(savedChatsFromDB.data.messages);
    setChats(savedChatsFromDB.data.messages);
    chatsRef = savedChatsFromDB.data.messages
  }
  func();
  }

  useEffect(() => {
    const handleClick = (e) => {
      if (contextMenuVisible) {
        const contextMenu = document.getElementById("context-menu");
        if (contextMenu && !contextMenu.contains(e.target)) {
          handleCloseContextMenu();
        }
      }
    };

    window.addEventListener("contextmenu", handleCloseContextMenu);
    window.addEventListener("click", handleCloseContextMenu);
    // window.addEventListener("scroll", handleCloseContextMenu);
    // window.addEventListener("scroll", ()=>{alert(2323)});
    refrenceOfP.current.addEventListener("contextmenu", handleContextMenu);
    refrenceOfP.current.addEventListener("click", handleClick);


    return () => { 
      window.removeEventListener("contextmenu", handleCloseContextMenu);
      window.removeEventListener("click", handleCloseContextMenu);
      // window.removeEventListener("scroll", handleCloseContextMenu);
      // chatContainerRef.removeEventListener("scroll", handleCloseContextMenu);
     
      if (refrenceOfP.current) {
        refrenceOfP.current.removeEventListener(
          "contextmenu",
          handleContextMenu
        );
        refrenceOfP.current.removeEventListener("click", handleClick);
      }
    };
  }, [contextMenuVisible]);

  return (
    <>
      {contextMenuVisible && (
        <Paper
          id="context-menu"
          sx={{
            position: "fixed",
            top: contextMenuPosition.top,
            left: contextMenuPosition.left,
            zIndex: "1234556",
          }}
        >
          <MenuList>
            <MenuItem onClick={handleMenuItemClick}>
              <ListItemIcon>
                <ContentCopy fontSize="small" />
              </ListItemIcon>
              <ListItemText>Copy</ListItemText>
            </MenuItem>
            <MenuItem onClick={()=>{delteForYouFunc(chatId.current,userInfo.current.email)}}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Delete for you</ListItemText>
            </MenuItem>
          {
            showDeleteForEveryOne
             && 
            <MenuItem onClick={()=>{deleteforEveryOneFunc(chatId.current,userInfo.current.email,selectedUser.email)}}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Delete for everyone</ListItemText>
          </MenuItem>
          }
          </MenuList>
        </Paper>
      )}
    </>
  );
};

// const InputComponent = ({inputElement,inputVal,setInputval,sendMez})=>{
//   return(
//    <>
//    </> 
//   )
// }
