import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import ChatsSkeleton from './ChatsSkeleton';
import Typography from '@mui/material/Typography';
import { Buffer } from 'buffer';
import url1 from '../urls/url';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import io from "socket.io-client";
import { Tooltip } from '@mui/material';

export default function UserLists({selectedUser,selectingUserFunc,usersList,dataArrived,obj,setObj,obj2}) {
    const api = 'https://api.multiavatar.com/45678945'
    const profileImageAvatar = localStorage.getItem("profileImageAvatar");
    // const [usersList,setUsersList] = useState([]);
    // const [dataArrived,setDataArrived] = useState(false);
    const [avatar,setAvatar] = useState('');
    const screenWidth = window.innerWidth;
    let userInfo;
    const userInfoUnparresed = localStorage.getItem("OnGraphTodoApp");
    if (userInfoUnparresed) {
      userInfo = JSON.parse(userInfoUnparresed);
    } 
    // const usersList = axios.get('url_here')

    // useEffect(()=>{
    //   async function func(){
    //   const time1 = new Date();
    //   const {data} = await axios.get(`${url1}/getAllUser`);
    //   const time2 = new Date();
    //   const timeTakenByServer = time2-time1;
    //   const slowTime = 2000 - timeTakenByServer;
    //   console.log(data);
    //   const updatedData = data.filter((user)=>{
    //     return user.email!==userInfo.email
    //   })
    //   if(timeTakenByServer<1999){
    //     setTimeout(()=>{
    //       setDataArrived(true);
    //       setUsersList(updatedData)
    //     },slowTime);
    //   }else{
    //     setDataArrived(true);
    //     setUsersList(updatedData)
    //   }
    //   }
    //   func()
    // },[])

    useEffect(() => {
      async function func() {
        try {
          const image = await axios.get(`${api}/${Math.round(Math.random() * 1000)}`);
          const buffer = Buffer.from(image.data);
          const imageData = buffer.toString('base64');
          return imageData;
        } catch (error) {
          console.error('Error fetching image:', error);
          // Handle the error here
        }
      }
    
      async function func1() {
        if (!profileImageAvatar) {
          try {
            const imageData = await func();
            const sendingAvatarOrgettingResponseFromBackendIsAatarAvaliable = await axios.post(
              `${url1}/userAvatarSaved`,
              { imageData: imageData, email: userInfo.email }
            );
            console.log(sendingAvatarOrgettingResponseFromBackendIsAatarAvaliable)
            if (sendingAvatarOrgettingResponseFromBackendIsAatarAvaliable.data.status === 201) {
              setAvatar(imageData);
              localStorage.setItem('profileImageAvatar', JSON.stringify({ imageData: imageData }));
            } else if (sendingAvatarOrgettingResponseFromBackendIsAatarAvaliable.data.avatar) {
              setAvatar(sendingAvatarOrgettingResponseFromBackendIsAatarAvaliable.data.avatar);
              localStorage.setItem('profileImageAvatar', JSON.stringify({ imageData: sendingAvatarOrgettingResponseFromBackendIsAatarAvaliable.data.avatar }));
            } else {
              console.log('error arrivedccc', sendingAvatarOrgettingResponseFromBackendIsAatarAvaliable.data.msg);
              // Handle the error here
            }
          } catch (error) {
            console.error('Error in func1:', error);
            // Handle the error here
          }
        }else{
          const imageDataObjFromLocalStorage = localStorage.getItem("profileImageAvatar");
          const imageDataObj = JSON.parse(imageDataObjFromLocalStorage);
          const imageData = imageDataObj.imageData;
          setAvatar(imageData)
        }
      }
      func1();
    }, []);
    
  return (
    <Container>
      <div id='appHeading'>
      <img id="imgLogo1" src="https://64c001d4ad4d710850d7fb62--rad-brigadeiros-491294.netlify.app/static/media/logo.ccfbd90732828204fa6989c0f15638c0.svg" alt="img"/>
      <Typography variant="h4" gutterBottom sx={{color:"white",padding:"0px",margin:'0px'}}>Friendzy</Typography>
      </div>
    <div id='listdata'>
    {
        dataArrived ? (<AllUsersLists usersList={usersList} avatar={avatar} selectedUser={selectedUser} selectingUserFunc={selectingUserFunc} obj={obj} setObj={setObj} obj2={obj2}/>) : <div id='divSkeleton'>
        <ChatsSkeleton/>
      </div> 
     }
    </div>
     <div id='userInformationAtBottom'>
     <ModalComponenet avatar={avatar?avatar:'uploads/default-avatar-profile-icon-of-social-media-user-vector.jpg'} imgClassName='userAvatarImageStyle' usernameText={userInfo.username} secondButton={true}/>
     <Typography variant="h5" sx={{color:"white"}}>{userInfo.username}</Typography>
     </div>
    </Container>
  )
}

const Container = styled.div`
   background-color: rgb(8, 4, 32);
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
 #appHeading{
    display: flex;
      width: 100%;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      padding: 20px 0px;
      background-color: rgb(1, 0, 8);
      border-bottom-width: 5px;
      border-bottom-color: white;
      border-bottom-style: solid;
    #imgLogo1{
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
 #divSkeleton{
   display: flex;
   justify-content: center;
   margin-top: 20px;
 }
 #listdata{
    height: 80%;
    overflow-y: auto;
 }
 #userInformationAtBottom{
    position: absolute;
    width: 100%;
    min-height: 80px;
    bottom: 0px;
    border-top-width: 5px;
    border-top-color: white;
    border-top-style: solid;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    background-color: rgb(1, 0, 8);
  }
 .userAvatarImageStyle{
        width: 60px;
        border-radius: 100%;
        @media screen and (max-width: 600px){
            width: 40px;
        }
    }
`


const AllUsersLists = ({usersList,avatar,selectedUser,selectingUserFunc,obj,setObj,obj2})=>{
  const userInfo = useRef(null);
  let socket = useRef(null);
  // const [obj,setObj] = useState({});

  useEffect(()=>{
    const userInfoUnparresed = localStorage.getItem("OnGraphTodoApp");
    if (userInfoUnparresed) {
      userInfo.current = JSON.parse(userInfoUnparresed);
    } 
  },[usersList]);

  // useEffect(()=>{
  //    let obj1 = {}
  //   if(usersList){
  //     usersList.forEach((element)=>{
  //      for(let i=element.messages.length-1; i>-1; i--){
  //        if(element.messages[i].sender===userInfo.current.email || element.messages[i].receiver===userInfo.current.email){
  //         // console.log(element)
  //         obj1[element.email] = element.messages[i];
  //         break;
  //       }
  //      }
  //     })
  //   }
  //   // console.log(obj1);
  //   setObj({...obj1})
  // },[]);


  // useEffect(()=>{
  //   socket.current =  io(url1);
  //   return ()=>{
  //     socket.current.close();
  //   }
  //  },[]);

  //  useEffect(()=>{
  //   function connectFunc() {
  //     socket.current.emit("initiatingSocket", {senderEmail:userInfo.current.email+1,recieverEmail:'s'});
  //   }

  //   function unreadMezFunc(data){
  //     // console.log(data);
  //   }
    
  //   socket.current.on("connect", connectFunc);
  //   socket.current.on("recievingdataFromBackendAtFronendforUseList", unreadMezFunc);
  //   return ()=>{
  //     socket.current.off("connect", connectFunc);
  //     socket.current.on("recievingdataFromBackendAtFronendforUseList", unreadMezFunc);
  //   }
  //  },[selectedUser])
 
   console.log('userslIst',usersList,obj);
  
  return(
    <UserListContainer>
       {
        usersList.map((user,index)=>{
          return(
            <div key={user._id} className='userBLockofData' id={`${selectedUser?.email===user.email?"selectedUserBlock":""}`}>
             <div style={{display:"flex",justifyContent:"flex-start",alignItems:'center',minWidth:'90%',gap:"1rem"}} onClick={()=>{
            //  if(selectedUser?.email!==user.email){
              selectingUserFunc(user); 
              setObj({ ...obj, [user.email]: { ...obj[user.email], unReadMez: 0 } })
               if(  obj2[user.email]?.unReadMez ){
                obj2[user.email].unReadMez = 0
               }
            //  }
              }}>
             <ModalComponenet avatar={user.avatar?user.avatar:'uploads/default-avatar-profile-icon-of-social-media-user-vector.jpg'} imgClassName='usersAvatar1' usernameText={user.username}/>
           <div>
           <Typography variant="h6" gutterBottom sx={{color:'white',margin:"0px"}}>{user.username}</Typography>
           <Typography variant="body2" gutterBottom sx={{ color: `${selectedUser?.email===user.email?"#121111":"#c5b9b9"}`, margin: "0px" }}>
            <Tooltip title={obj[user.email]?.text}>
            {obj[user.email]?.type==='image'?("Image"):(obj[user.email]?.text ? (obj[user.email].text.substring(0, 10) + (obj[user.email]?.text.length>10 ? "...":"")) : '')}
            </Tooltip>
            </Typography>

           </div>
              <div style={{position:'absolute',bottom:"0px",right:'1px',borderRadius:'500px',border:"0px solid #000000",backgroundColor:"#ffffff",width:'20px',display:'flex',justifyContent:'center',alignItems:"center"}}>
             <Typography variant="body2" gutterBottom sx={{ color: '#000000', margin: "0px" }}>
              {obj[user.email]?.unReadMez===0?"":obj[user.email]?.unReadMez}
              </Typography>
             </div>
             </div>
            </div>
          )
        })
       }
     
    </UserListContainer>
  )
}

const UserListContainer = styled.div` 
display: flex;
flex-direction: column;
gap: 1rem;
padding: 10px;
.usersAvatar1{
  width: 45px;
  border-radius: 100%;
}
.userBLockofData{
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #6445ca;
  border-radius: 4px;
  cursor: pointer;
  transform: 0.3s ease;
  &:hover{
    background-color: #582bea;
  }
}
#selectedUserBlock{
  background-color: #fc7474;
  transition: all 0.5s ease;
  /* animation: animateBackgroundColorOfSelectedUser 2s ease infinite; */
}
/* @keyframes animateBackgroundColorOfSelectedUser {
  0%{
    background-color: #fc7474;
  }
  50%{
    background-color: #f61a1a;
  }
  100%{
    background-color: #fc7474;
  }
} */
`

export const ModalComponenet = ({avatar,imgClassName,usernameText,aniamtion=false,selectedUser={},secondButton=false,type=''})=>{
  const navigate = useNavigate();
  const screenWidth = window.innerWidth;
  const userImageRef = useRef(null);
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const startAnimation = () => {
    if (userImageRef.current) {
      const keyframes = [
        { transform: 'scale(1)' },
        { transform: 'scale(1.4)' },
        { transform: 'scale(1)' },
      ];

      const options = {
        duration: 1000, // 1 second
        easing: 'ease',
      };

      const animation = userImageRef.current.animate(keyframes, options);
      setTimeout(() => animation.cancel(), 1000);
    }
  };

  const handleClickOpen = (e) => {
    e.stopPropagation();
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };
  useEffect(()=>{
    if(aniamtion){
       startAnimation()
    }  
  },[selectedUser])
  const urlString = `${url1}/${avatar}`
  return(
    <ModalDiv>
      <div style={{width:'100%',height:'100%',display:"flex",justifyContent:"center",alignItems:"center",cursor:'pointer'}}>
      {(avatar ? avatar : 'abcddd')?.startsWith ("PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMzEgMjMxIj48cGF0aCBkPSJNMzMuODMsMzMuODNhMTE1LjUsMTE1LjUsMCwxLDEsMCwxNjMuMzQsMTE1LjQ5LDExNS") ? <img loading="lazy"  ref={userImageRef} src={`data:image/svg+xml;base64,${avatar}`} className={imgClassName} alt='img' onClick={(e)=>{handleClickOpen(e); e.stopPropagation();}}/> : type==='image'?(<img loading="lazy"  ref={userImageRef} src={`${((avatar ? avatar : 'abcddd')).startsWith('uploads')? urlString: avatar}`} className={imgClassName} alt='img' onClick={(e)=>{handleClickOpen(e)}}/>):(<img loading="lazy"  ref={userImageRef} src={`${url1}/${avatar}`} className={imgClassName} alt='img' onClick={(e)=>{handleClickOpen(e)}}/>)}

      </div>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        sx={{zIndex:23232,width:"100%",minWidth:"60%"}}
      >
   <DialogTitle id="responsive-dialog-title">
          {usernameText}
        </DialogTitle>
        <DialogContent>
          {
            ((avatar ? avatar : 'abcddd')).startsWith("PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMzEgMjMxIj48cGF0aCBkPSJNMzMuODMsMzMuODNhMTE1LjUsMTE1LjUsMCwxLDEsMCwxNjMuMzQsMTE1LjQ5LDExNS") ? <img  className='img123456' src={`data:image/svg+xml;base64,${avatar}`} width={screenWidth>600?screenWidth*30/100:screenWidth*80/100} alt='img'/> : type==='image'?(<ImageMagnifier  src={`${((avatar ? avatar : 'abcddd')).startsWith('uploads')? urlString: avatar}`} width={screenWidth>900?screenWidth*40/100:screenWidth*80/100} className='img123456'  alt='img' onClick={(e)=>{handleClickOpen(e)}}/>):(<img  src={`${url1}/${avatar}`}  className='img123456' width={screenWidth*30/100}  alt='img' onClick={(e)=>{handleClickOpen(e)}}/>)
          }
        </DialogContent>
        <DialogActions>
       {
        secondButton && <Button variant="contained" onClick={()=>{navigate("/changeDp")}}>Change Dp</Button>
       }
          <Button  variant="contained" onClick={handleClose} autoFocus>
            close
          </Button>
        </DialogActions>
      </Dialog>
    </ModalDiv>
  )
}

const ModalDiv = styled.div`
.img123456{
  @media screen and (max-width: 1000px) {
     width: 60%;
  }
}
`

function ImageMagnifier({
  src,
  width,
  height,
  magnifierHeight = 400,
  magnifieWidth = 400,
  zoomLevel = 2
}) {
  const [[x, y], setXY] = useState([0, 0]);
  const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
  const [showMagnifier, setShowMagnifier] = useState(false);
  return (
    <div
      style={{
        position: "relative",
        height: height,
        width: width
      }}
    >
      <img
        src={src}
        loading='lazy'
        style={{ height: height, width: width }}
        onMouseEnter={(e) => {
          // update image size and turn-on magnifier
          const elem = e.currentTarget;
          const { width, height } = elem.getBoundingClientRect();
          setSize([width, height]);
          setShowMagnifier(true);
        }}
        onMouseMove={(e) => {
          // update cursor position
          const elem = e.currentTarget;
          const { top, left } = elem.getBoundingClientRect();

          // calculate cursor position on the image
          const x = e.pageX - left - window.pageXOffset;
          const y = e.pageY - top - window.pageYOffset;
          setXY([x, y]);
        }}
        onMouseLeave={() => {
          // close magnifier
          setShowMagnifier(false);
        }}
        alt={"img"}
      />

      <div
        style={{
          display: showMagnifier ? "" : "none",
          position: "absolute",

          // prevent magnifier blocks the mousemove event of img
          pointerEvents: "none",
          // set size of magnifier
          height: `${magnifierHeight}px`,
          width: `${magnifieWidth}px`,
          // move element center to cursor pos
          top: `${y - magnifierHeight / 2}px`,
          left: `${x - magnifieWidth / 2}px`,
          opacity: "1", // reduce opacity so you can verify position
          border: "1px solid lightgray",
          backgroundColor: "white",
          backgroundImage: `url('${src}')`,
          backgroundRepeat: "no-repeat",

          //calculate zoomed image size
          backgroundSize: `${imgWidth * zoomLevel}px ${
            imgHeight * zoomLevel
          }px`,

          //calculate position of zoomed image.
          backgroundPositionX: `${-x * zoomLevel + magnifieWidth / 2}px`,
          backgroundPositionY: `${-y * zoomLevel + magnifierHeight / 2}px`
        }}
      ></div>
    </div>
  );
}

