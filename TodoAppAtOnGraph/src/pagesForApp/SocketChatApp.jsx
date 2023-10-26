import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import UserLists from '../components/UserLists'
import ChatContainer from '../components/ChatContainer'
import axios from 'axios';
import url1 from '../urls/url';

export default function SocketChatApp() {
  const [selectedUser,setSelectedsuer] = useState(null);
  const [usersList,setUsersList] = useState([]);
  const [dataArrived,setDataArrived] = useState(false);
  const [obj,setObj] = useState({});
  const obj2 = useRef(null);
  const usersListRef = useRef(null);
  const chatContainerref = useRef(null);
  const screenWidth = window.innerWidth;
  const userInfo = useRef(null);

  function selectingUserFunc(user){
    if(user!==null){
      setSelectedsuer({...user});
     if(screenWidth<600){
      usersListRef.current.style.width = '0vw'
      chatContainerref.current.style.width = '100vw'
      usersListRef.current.style.display = 'none'
      chatContainerref.current.style.display = 'block'
     }
    }
    else{
      setSelectedsuer(null);
      if(screenWidth<600){
        usersListRef.current.style.width = '100vw'
        chatContainerref.current.style.width = '0vw'
        usersListRef.current.style.display = 'block'
        chatContainerref.current.style.display = 'none'
      }
    }
  }

  function updatingObjFunc(email,newValue){
    console.log(email,newValue)
    let newObj;

    if (selectedUser.email !== email) {
      newObj = {
        ...obj2.current,
        [email]: {
          ...newValue,
          unReadMez: (obj2.current[email]?.unReadMez || 0) + 1,
        },
      };
    } else {
      newObj = {
        ...obj2.current,
        [email]: newValue,
      };
    }
    
    console.log(newObj);
    setObj(newObj);
    

    obj2.current = ({...newObj});
    const newUserList = usersList.map((user)=>{
      return ({...user,time:(newObj[user.email]?.time ? newObj[user.email]?.time : '')})
    });
    newUserList.sort((a, b) => new Date(b.time) - new Date(a.time));
    setUsersList(prevUserList=>newUserList);
  }

  function addingTimingAndlastMez(usersList){
    let obj1 = {}
    if(usersList){
      usersList.forEach((element)=>{
        let unReadMessages = 0
       for(let i=element.messages.length-1; i>-1; i--){
         if(element.messages[i].sender===userInfo.current.email || element.messages[i].receiver===userInfo.current.email){
          obj1[element.email] = element.messages[i];
          break;
        }
       }
       for(let i=element.messages.length-1; i>-1; i--){
         if((element.messages[i].receiver===userInfo.current.email && element.messages[i].sender===element.email) && !element.messages[i].isMezRead){
          unReadMessages = unReadMessages + 1;
          obj1[element.email].unReadMez = unReadMessages;
          // break;
        }
       }
      })
    }
    // console.log(obj1);
    setObj({...obj1})
    obj2.current = ({...obj1});
    const newUserList = usersList.map((user)=>{
     return ({...user,time:obj1[user.email]?.time ? obj1[user.email]?.time  : '1970-01-01T00:00:00.000Z'})
      })
    //  console.log('newuserList',newUserList);
   newUserList.sort((a, b) => new Date(b.time) - new Date(a.time));
   setUsersList(newUserList);
  }
 

  useEffect(()=>{
   const userInfoUnparresed = localStorage.getItem("OnGraphTodoApp");
   if (userInfoUnparresed) {
     userInfo.current = JSON.parse(userInfoUnparresed);
   } 
  },[])
  
  useEffect(()=>{
    async function func(){
    const time1 = new Date();
    const {data} = await axios.get(`${url1}/getAllUser`);
    const time2 = new Date();
    const timeTakenByServer = time2-time1;
    const slowTime = 2000 - timeTakenByServer;
    // console.log(data);
    const updatedData = data.filter((user)=>{
      return user.email!==userInfo.current.email
    })
    if(timeTakenByServer<1999){
      setTimeout(()=>{
        setDataArrived(true);
        setUsersList(updatedData)
        addingTimingAndlastMez(updatedData);
      },slowTime);
    }else{
      setDataArrived(true);
      setUsersList(updatedData);
      addingTimingAndlastMez(updatedData);
    }
    }
    func()
  },[])

  useEffect(()=>{
    if(screenWidth<600){
      usersListRef.current.style.width = '100vw'
      chatContainerref.current.style.width = '0vw'
      usersListRef.current.style.display = 'block'
      chatContainerref.current.style.display = 'none'
    }
  },[])
  return (
    <MainCont>
       <div ref={usersListRef} id='userListDiv'>
        <UserLists selectedUser={selectedUser} selectingUserFunc={selectingUserFunc} usersList={usersList} dataArrived={dataArrived} obj={obj} setObj={setObj} obj2={obj2.current}/>
       </div>
       <div ref={chatContainerref} id='chatContainerDiv'>
        <ChatContainer selectedUser={selectedUser} selectingUserFunc={selectingUserFunc} updatingObjFunc={updatingObjFunc}/>
       </div>
    </MainCont>
  )
}

const MainCont = styled.div`
width: 100vw;
display: flex;
flex-direction: row;
height: 100vh;
margin: 0px;
    #userListDiv{
        width: 30vw;
        min-height: 100vh;
    }
    #chatContainerDiv{
     width: 70vw;
     min-height: 100vh;
    }
`