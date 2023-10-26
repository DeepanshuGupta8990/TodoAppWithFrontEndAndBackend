import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { Link, json } from 'react-router-dom';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingImage from '../image/loading.gif'
import { useAuth0 } from "@auth0/auth0-react";

const FormContainer = styled.div`
height: 100vh;
width: 100vw;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
gap: 1rem;
background-color: #131324;
overflow: hidden;
#loadingdiv {
    position: absolute;
    width: 100vw;
    height: 100vh;
    background-color: white;
    opacity: 0.2;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      opacity: 1;
    }
  }
.brand{
  display: flex;
  align-items: center;
  justify-content: center;
  img{
    height: 5rem;
  }
  h1{
    color: white;
    text-transform: uppercase;
  }
}
form{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  background-color: #00000076;
  border-radius: 2rem;
  padding: 3rem 5rem;
  input{
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    transition: border 0.5s ease;
    &:focus{
      border: 0.1rem solid #997af0;
      outline: none;
    }
    @media only screen and (max-width: 600px) {
      width: 70%;
    }
  }
  button{
    background-color: #997af0;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    transition: 0.5s ease-in-out;
    &:hover{
      background-color: #4e0eff;
    }
  }
  span{
    color: white;
    text-transform: uppercase;
    a{
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
}
@media only screen and (max-width: 470px) {
   form{
    width: 95%;
   }
}
@media only screen and (max-width: 480px) {
   form{
    width: 100%;
    padding: 0.8rem;
    input{
     margin: 0;
    }
   }
}
`;

export default function Singup() {
  const [disableVal,setDisableVal] = useState(false);
  const [disableAuth,setDisableAuth] = useState(false);
  const navigate = useNavigate();
  const [loadingAniamtion,setLoadingAnimation] = useState(true)
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: '',
    confirmPassword: ""
  })
  const { user,loginWithRedirect } = useAuth0();

   const toastOptions = {
    position: "top-right",
    autoClose: "8000",
    pauseOnHover: true,
    draggable: true,
    theme: 'dark',
  }

  let userInfo;
  async function createUserFunction(valuess,entry=false){
    const { password, confirmPassword, username, email } = valuess;
    const {data} = await axios.post('https://websocketchatapp.tanujagupta.repl.co/signup',{
      username,
      email,
      password
    })
    if(data.status!==201){
     if(entry){
       const message = data.msg
       return message;
     }else{
      toast.error(data.msg,toastOptions)
     }
    }
    if(data.status===201){
      toast.success("User Created Succesfully",toastOptions)
      localStorage.setItem("OnGraphTodoApp",JSON.stringify({username,email,password}))
      // setLoadingAnimation(false)
      setTimeout(()=>{
        navigate('/home',{replace:true})
      },0)
    }
  }

  async function isUserRegistered(entry=false){
    const userInfoUnparsed = localStorage.getItem("OnGraphTodoApp");
    if (userInfoUnparsed) {
       userInfo = JSON.parse(userInfoUnparsed);
      navigate('/home', { replace: true });
      // Consider displaying a user-friendly message instead of an alert.
    } else {
      if (user && user.email) {
        const passValues = {
          username: user.name,
          email: user.email,
          password: 'abcdefg123456@123',
        };
        let message;

        async function func1() {
          message = await createUserFunction(passValues, true);

          if (true) {
            localStorage.setItem("OnGraphTodoApp", JSON.stringify(passValues));
            navigate('/home');
          } else {
            toast.error(message,toastOptions);
          }
        }

        func1();
      } else {
        // loginWithRedirect({ redirectUri: 'http://localhost:3000/home' });
       if(entry){
        loginWithRedirect()
       }
       setLoadingAnimation(false)
      }
    }
  }
console.log(user,'user')
  async function auth0Func() {
    try {
      isUserRegistered(true)
    } catch (error) {
      console.error(error.message);
      // Handle the error in an appropriate manner.
    }
  }

  const handleValidation = () => {
    const { password, confirmPassword, username, email } = values;
    setDisableVal(true)
    if (password !== confirmPassword) {
      toast.error("Password and confirm password should be same", toastOptions)
      return false;
    }
    else if (username.length < 3) {
      toast.error("UserName should be greater than 3 charater", toastOptions);
      return false;
    }
    else if (password.length < 6) {
      toast.error("Password should be greater than 6 charater", toastOptions);
      return false;
    } else if (email === '') {
      toast.error("Email is required", toastOptions)
    }
    return true;
  }

  const handleSubmit = async (event) => {
   try {
    event.preventDefault();
    if (handleValidation()) {
      createUserFunction(values);
    }
   } catch (error) {
    toast.error(error.message,toastOptions)
   }finally{
    setTimeout(()=>{
      setDisableVal(false)
    },500)
   }
  }
  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value
    })
  }

  useEffect(()=>{
    const userInfoUnparsed = localStorage.getItem("OnGraphTodoApp");
    if (userInfoUnparsed) {
       userInfo = JSON.parse(userInfoUnparsed);
      navigate('/home', { replace: true });
      // Consider displaying a user-friendly message instead of an alert.
    }
      isUserRegistered();
  },[user])
  return (
    <>
      <FormContainer>
        {loadingAniamtion && (
        <div id="loadingdiv">
          <img src={LoadingImage} alt="ddsd" height={34.5} />
        </div>
      )}
        <form>
          <div className='brand'>
            <h1>Todo App</h1>
          </div>
          <input type="text" placeholder='UserName' name='username' onChange={(e) => { handleChange(e) }} />
          <input type="email" placeholder='Email' name='email' onChange={(e) => { handleChange(e) }} />
          <input type="password" placeholder='Password' name='password' onChange={(e) => { handleChange(e) }} />
          <input type="password" placeholder='Confirm Passwprd' name='confirmPassword' onChange={(e) => { handleChange(e) }} />
          <div style={{display:'flex',flexDirection:"row",gap:'1rem'}}>
          <button type='submit' disabled={disableVal} onClick={(event) => { handleSubmit(event) }}>{
            disableVal ? <img src={LoadingImage} alt="ddsd" height={14.5}/> : 'Register'
          }</button>
          <button onClick={(e)=>{
            e.preventDefault()
            setDisableAuth(true)
            auth0Func()
            }}>{
              disableAuth ? <img src={LoadingImage} alt="ddsd" height={14.5}/> : 'Auth0'
            }</button>
          </div>
          <span>
            Already have an account ? <Link to='/login'>Login</Link>
          </span>

        </form>
      </FormContainer>
      <ToastContainer />
    </>
  )
}

