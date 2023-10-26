import axios from 'axios';
import React, { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Buffer } from 'buffer';
import styled from 'styled-components';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import url1 from '../urls/url';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ChangeDp() {
    const imageDataObjFromLocalStorage = localStorage.getItem("profileImageAvatar");
    const imageDataObj = JSON.parse(imageDataObjFromLocalStorage);
    const imageData = imageDataObj.imageData;
    const screenWidth = window.innerWidth;
    const avatarArrayRef = useRef([]);
    const [avatarsArray,setAvatarArray] = useState([]);
    const fileInputRef = useRef(null);
    const [selectedImageFromGallery, setSelectedImageFromGallery] = useState(null);
    const [selectedImageUrl,setSelectedImageUrl]= useState(null);
    const [selectedAvatar,setSelectedAvatr] = useState(null);
    const api = 'https://api.multiavatar.com/45678945'
    const navigate = useNavigate();
    let userInfo = useRef(null);

    const toastOptions = {
      position: "top-right",
      autoClose: "8000",
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
    };
  

    useLayoutEffect(()=>{
      try {
        const userInfoUnparresed = localStorage.getItem("OnGraphTodoApp");
        if (userInfoUnparresed) {
          userInfo.current = JSON.parse(userInfoUnparresed);
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.log(error.message);
      }
    },[])

    const handleFileSelection = async (event) => {
      const selectedFile = event.target.files[0];
       setSelectedImageFromGallery(event.target.files[0]);
       if (selectedFile) {
        const reader = new FileReader();
    
        reader.onload = (e) => {
          setSelectedImageUrl(e.target.result);
        };
    
        reader.readAsDataURL(selectedFile);
      }
    };

    async function uploadProfileImageFromGallery(){
      if (selectedImageFromGallery) {
        try {
          const formData = new FormData();
          formData.append('image', selectedImageFromGallery);
          formData.append('email', userInfo.current.email);
          const response = await axios.post(`${url1}/avatarUpdated`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
  
          console.log('File uploaded successfully:', response.data);
          if(response.data.status===201){
            localStorage.setItem('profileImageAvatar',JSON.stringify({imageData:response.data.imagePath}));
            toast.success("Profile Image updated",toastOptions);
            setSelectedImageFromGallery(null);
          }
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      }
    }

    const openFileInput = () => {
        fileInputRef.current.click();
      };

    const selectAvatarFunction = async()=>{
     if(selectedAvatar!==null){
      const setAvatarAtBackend = await axios.post(`${url1}/avatarUpdated2`,{imagePath:imageData,email:userInfo.current.email,avatarString:selectedAvatar});
      console.log(setAvatarAtBackend);
      if(setAvatarAtBackend.data.status===200){
        localStorage.setItem('profileImageAvatar',JSON.stringify({imageData:selectedAvatar}));
      }
      if(setAvatarAtBackend.status===200){
        toast.success("Avatar Updated",toastOptions)
      }
     }else{
      toast.error("Please select an avatar first",toastOptions)
     }
    }  

    useEffect(()=>{
        async function func() {
            try {
             for(let i=0; i<1; i++){
                const image = await axios.get(`${api}/${Math.round(Math.random() * 1000)}`);
                const buffer = Buffer.from(image.data);
                const imageData = buffer.toString('base64');
                avatarArrayRef.current = [...avatarArrayRef.current,imageData];
                }
             return avatarArrayRef.current;   
            } catch (error) {
              console.error('Error fetching image:', error);
            }
          }
          async function func2(){
             const funcCall = await func();
             setAvatarArray(funcCall);
             console.log(avatarArrayRef.current);
             
          }
          func2();
    },[])
  return (
    <>
    <ChangeDpContainer>
   <Typography variant="h4" sx={{color:"white"}} gutterBottom>
      Please select your avatar
      </Typography>
      <div id='AvatarsBox'>
        {
         !selectedImageFromGallery ? avatarsArray.map((avatar,index)=>{
            return(
                <Fragment  key={index}>
                  <img src={`data:image/svg+xml;base64,${avatar}`} className={`avatarImages12345 ${selectedAvatar===avatar?"newlySelectedAvatar":""}`} alt='img' onClick={(e)=>{setSelectedAvatr(avatar)}}/>
                </Fragment>
            )
         })
         :  <img src={selectedImageUrl} alt="Selected Image" className='avatarImages12345'/>
        }
      </div>
      <Stack sx={{margin:"20px"}} spacing={2} direction="row">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileSelection}
      />
      <Button variant="contained" onClick={openFileInput}>Select image from gallery</Button>
      {
        selectedImageFromGallery===null ? <Button variant="outlined" onClick={()=>{selectAvatarFunction()}}>Select avatar</Button> : <Button variant="outlined" onClick={()=>{uploadProfileImageFromGallery()}}>Update profile image</Button>
      }
    </Stack>
    </ChangeDpContainer>
    <ToastContainer />
    </>
  )
}

const ChangeDpContainer = styled.div`
    background: linear-gradient(180deg, #4d408e, #0c0629);
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    #AvatarsBox{
        width: 80%;
        min-height: 20%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 1.5rem;
        background-color: #1f1c56;
        @media screen and (max-width: 600px) {
            flex-direction: column;
        }
    }
    .avatarImages12345{
        width: 10%;
        cursor: pointer;
        transition: all 0.5s ease;
        border-radius: 200px;
        @media screen and (max-width: 600px) {
            width: 30%;
        }
    }
    .newlySelectedAvatar{
      border: 5px solid purple;
      padding: 5px;
      transform: scale(1.5);
    }
`