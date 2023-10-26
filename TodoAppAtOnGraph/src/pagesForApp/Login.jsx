import React,{useState} from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import {styled} from 'styled-components';
import axios from 'axios';
import LoadingImage from '../image/loading.gif'
import { useAuth0 } from "@auth0/auth0-react";

export default function Login() {
  const { user } = useAuth0();
  const navigate = useNavigate();
  const [disableVal,setDisableVal] = useState(false);
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: '',
  })
  console.log(user,'sdsdsdasdsa')
  const toastOptions = {
    position: "top-right",
    autoClose: "8000",
    pauseOnHover: true,
    draggable: true,
    theme: 'dark',
  }
  const handleValidation = () => {
    const { password, confirmPassword, username, email } = values;
    if (password === '') {
      toast.error("Please provide password", toastOptions)
      return false;
    }
    else if (email === '') {
      toast.error("Email is required", toastOptions)
    }
    return true;
  }
  const handleSubmit = async (event) => {
        try {
          event.preventDefault();
          if (handleValidation()) {
            const { password, username, email } = values;
            console.log(password,email)
            setDisableVal(true);
            const {data} = await axios.post('https://websocketchatapp.tanujagupta.repl.co/login',{
              username:username,
              email:email,
              password:password
            });
            console.log(data)
            if(data.status===201){
              toast.success("User verified succesfully",toastOptions)
              localStorage.setItem("OnGraphTodoApp",JSON.stringify({username,email,password}));
              setTimeout(()=>{
                navigate('/home',{replace:true})
              },1000)
            } 
            else{
              toast.error(data.msg,toastOptions)
          
            }
           
          }
        } catch (error) {
          toast.error(error.message,toastOptions)
        }finally{
          setTimeout(()=>{
            setDisableVal(false)
          },1000)
        }
  }
 const handleChange = (e) => {
  setValues({
    ...values,
    [e.target.name]: e.target.value
  })
}
  return (
  <>
      <FormContainer>
        <form onSubmit={(event) => { handleSubmit(event) }}>
          <div className='brand'>
            <h1>Todo APP</h1>
          </div>
          <input type="text" placeholder='UserName' name='username' onChange={(e) => { handleChange(e) }} />
          <input type="email" placeholder='Email' name='email' onChange={(e) => { handleChange(e) }} />
          <input type="password" placeholder='Password' name='password' onChange={(e) => { handleChange(e) }} />
          <button type='submit' disabled={disableVal}>{
            disableVal ? <img src={LoadingImage} alt="ddsd" height={14.5}/> : 'Login'
          }</button>
          <span>
            Don't have any account ? <Link to='/'>Register</Link>
          </span>

        </form>
      </FormContainer>
      <ToastContainer />
  </>
  )
}


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
  @media only screen and (max-width: 600px) {
      width: 7%;
    }
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