import React, { useEffect } from 'react';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import axios from 'axios';

export default function ChatsSkeleton() {
    const screenWidth = window.innerWidth;
  return (
       <Stack spacing={1.5}>
        <CustomSkeleton/>
        <CustomSkeleton/>
        <CustomSkeleton/>
        <CustomSkeleton/>
        <CustomSkeleton/>
        <CustomSkeleton/>
    </Stack>
  )
}

const CustomSkeleton = ()=>{
    const screenWidth = window.innerWidth;
    const blockWidth = (screenWidth*30/100)*60/100
    return(
        <div style={{position:'relative',overflow:'hidden'}}>
          <Skeleton variant="rounded" width={screenWidth>600?(26 * screenWidth / 100):(80 * screenWidth / 100)} height={60} sx={{ backgroundColor: '#323675' }}/>
          <div style={{position:"absolute",top:"11px",left:"10px"}}>
          <Skeleton variant="circular" width={screenWidth>600?40:40} height={screenWidth>600?40:40} sx={{ backgroundColor: '#3e46bb' }} />
          </div>
           <div style={{position:"absolute",top:"14px", left:`${screenWidth>600? '60px' : "60px"}`}}>
          <Skeleton variant="rounded" width={screenWidth>600?blockWidth:(screenWidth*60/100)} height={30} sx={{backgroundColor:"#323675"}}/>
          </div>
        </div>
    )
}