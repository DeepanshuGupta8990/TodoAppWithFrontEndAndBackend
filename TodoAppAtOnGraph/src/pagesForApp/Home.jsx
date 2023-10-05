import axios from 'axios';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import LoadingImage from '../image/loading.gif'

export default function Home() {
  const navigate = useNavigate();
  const uniqueId = uuidv4();
  const inputRef = useRef(null);
  const [todo,setTodo] = useState("");
  const [todoArray,setTodoArray] = useState([]);
  const [updateButtonActive,setUpdateButtonActive] = useState(false);
  const [todoId,setTodoId] = useState(null);
  const [animationDelay,setAnimationDelay] = useState(true);
  const [loadingAniamtion,setLoadingAnimation] = useState(false)
  const todoListRef = useRef(null) 
  // const scrollBarToBottom = useRef(false)
  let userInfo;

    try {
      const userInfoUnparresed =localStorage.getItem("OnGraphTodoApp");
      if(userInfoUnparresed){
        userInfo = JSON.parse(userInfoUnparresed)
      }else{
        navigate("/login")
      }
    } catch (error) {
      console.log(error.message)
    }



  async function updateTodosFunc(){
     try { 
      setUpdateButtonActive(false);
      setTodoId(null);
      setLoadingAnimation(true)
      const updateRequiredTodo = todoArray.find((todo)=>{
       return todo.todoid === todoId
      })
      const oneMinusTodoArray = todoArray.filter((todo)=>{
       return todo.todoid!==todoId
      }) 
      const todoArray2 = [...oneMinusTodoArray,{...updateRequiredTodo,todo:todo}]
     const data = await axios.post('http://localhost:4500/updateTodo',{todoArray:todoArray2,email:userInfo.email,password:userInfo.password,});
     if(data.data.status === 200){
      const currentDate = new Date();
      const sortedTodoArray = data.data.todosArray.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        const timeDifferenceA = Math.abs(currentDate - dateA);
        const timeDifferenceB = Math.abs(currentDate - dateB);
        return timeDifferenceA - timeDifferenceB; // To sort in ascending order
      });
       setTodoArray(sortedTodoArray);
       setTodo('');
      }else{
        console.log('err arrived')
      }
     } catch (error) {
       console.log(error.message)
     }finally{
      setTimeout(()=>{
        setLoadingAnimation(false);
      },400)
     }
  }
  async function keyDownFunc(e){
    try {
      if(e.key === "Enter" || e.keyCode === 13){
        if(todo!=='' && updateButtonActive===false){
          setLoadingAnimation(true)
          setUpdateButtonActive(false);
          const newTodoArray = [
            ...todoArray,
            {todo:todo,todoid:uniqueId,date:new Date()}
          ]
          const {data} = await axios.post("http://localhost:4500/add",{todoArray:newTodoArray,email:userInfo.email,password:userInfo.password})
          if(data.status === 201){
            const currentDate = new Date();
            const sortedTodoArray = data.todosArray.sort((a, b) => {
              const dateA = new Date(a.date);
              const dateB = new Date(b.date);
              const timeDifferenceA = Math.abs(currentDate - dateA);
              const timeDifferenceB = Math.abs(currentDate - dateB);
              return timeDifferenceA - timeDifferenceB; // To sort in ascending order
            });
            setTodoArray(sortedTodoArray)
            setTodo('');
            // scrollBarToBottom.current = true;
          }
      
        }else if(todo!=='' && updateButtonActive===true){
          setLoadingAnimation(true)
          updateTodosFunc();
        }
       }
    } catch (error) {
      console.log(error.message)
    }finally{
      setTimeout(()=>{
        setLoadingAnimation(false);
      },400)
    }
  }
  async function cancelFunc(){
    setTodo("");
    setUpdateButtonActive(false);
    setTodoId(null);
  }
  async function addTodoFunc(){
    try {
      if(todo.length>1){
        setUpdateButtonActive(false);
        setLoadingAnimation(true)
        const newTodoArray = [
          ...todoArray,
          {todo:todo,todoid:uniqueId ,date:new Date()}
        ]    
        const {data} = await axios.post("http://localhost:4500/add",{todoArray:newTodoArray,email:userInfo.email,password:userInfo.password})
        if(data.status === 201){
          const currentDate = new Date();
          const sortedTodoArray = data.todosArray.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            const timeDifferenceA = Math.abs(currentDate - dateA);
            const timeDifferenceB = Math.abs(currentDate - dateB);
            return timeDifferenceB - timeDifferenceA; // To sort in ascending order
          });
          setTodoArray(sortedTodoArray)
          setTodo('');
          // scrollBarToBottom.current = true;
        }
    
       }
    } catch (error) {
      console.log(error.message)
    }finally{
      setTimeout(()=>{
        setLoadingAnimation(false)
      },400)

    }
  }
  function updateFunc(todoElement){
    setTodo(todoElement.todo)
    setUpdateButtonActive(true);
    setTodoId(todoElement.todoid)
    inputRef.current.focus();
  }
  async function removeFunc(todoElement){
    try {
      if(todoElement.todoid===todoId){
        setUpdateButtonActive(false);
        setTodo('');
      }
      setTodoId(null)
      setLoadingAnimation(true)
      const newTodoArray = todoArray.filter((todo)=>{
        return todo.todoid !== todoElement.todoid
      })
      const {data} = await axios.post('http://localhost:4500/deleteTodo',{todoArray:newTodoArray,email:userInfo.email,password:userInfo.password,});
      if(data.status===200){
        setTodoArray(newTodoArray)
      }else{
        console.log('err arrived')
      }
    } catch (error) {
      console.log(error.message)
    }finally{
      setLoadingAnimation(false)
    }
  }

  useEffect(()=>{
    try {
      async function func(){
        const data = await axios.post('http://localhost:4500/getTodos',{email:userInfo?.email,password:userInfo?.password});
        // console.log(data);
        if(data.data.todosArray){
          const currentDate = new Date();
          const sortedTodoArray = data.data.todosArray.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            const timeDifferenceA = Math.abs(currentDate - dateA);
            const timeDifferenceB = Math.abs(currentDate - dateB);
            return timeDifferenceA - timeDifferenceB; // To sort in ascending order
          });
          setTodoArray(sortedTodoArray)
          console.log(data.data.todosArray)
          setTimeout(()=>{
              setAnimationDelay(false)
          },1000)
        }else{
          navigate("/")
        }
      }
      func()
    } catch (error) {
      console.log(error.message)
    }
  },[])

  // useEffect(()=>{
  //   if (todoListRef.current && scrollBarToBottom.current) {
  //     todoListRef.current.scrollTop = todoListRef.current.scrollHeight;
  //     scrollBarToBottom.current = false;
  //   }
  // },[todoArray])

  return (
    <Container>
    {
      loadingAniamtion 
      &&   
      <div id='loadingdiv'>
      <img src={LoadingImage} alt="ddsd" height={34.5}/>
      </div>
    }
      <div id='inputCont'>
      <input ref={inputRef} type="text" placeholder='Write you todo here' value={todo} onChange={(e)=>{setTodo(e.target.value)}}
      onKeyDown={(e)=>{keyDownFunc(e)}}
      />
    {
      updateButtonActive ? (<button onClick={updateTodosFunc}>Update</button>) : (<button type='submit' onClick={addTodoFunc}>Add</button>)
    }
      </div>
      <div id='todoList' ref={todoListRef}>
           {
            todoArray.map((todoElement,index)=>{
               return(
                <div  key={todoElement.todoid} className={`${todoElement.todoid===todoId?"updateAskingTodo":""} todoElement`} style={{animationDelay:`${animationDelay ? index*0.1 : 0}s`}}>
                   <p>{todoElement.todo}</p>
                   <button onClick={()=>{removeFunc(todoElement)}}>Remove</button>
               {
                todoElement.todoid === todoId ? (<button onClick={cancelFunc}>Cancel</button>) : (<button onClick={()=>{updateFunc(todoElement)}}>Update</button>)
               }
                </div>
               )
            })
           }
           {
            todoArray.length < 1 ? (<h3>No todos made yet 😅</h3>) : ""
           }
      </div>
    </Container>
  )
}

const Container = styled.div`
height: 100vh;
width: 100vw;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
gap: 1rem;
background-color: #131324;
margin: 0;
#loadingdiv{
  position: absolute;
  width: 100vw;
  height: 100vh;
  background-color: white;
  opacity: 0.2;
  display: flex;
  justify-content: center;
  align-items: center;
  img{
    opacity: 1;
  }
}
#inputCont{
  width: 40%;
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  gap: 1rem;
  @media only screen and (max-width: 1200px){
    flex-direction: column;
    width: 80%;
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
  }
  #todoList{
  width: 40%;
  height: 60%;
  background-color: #6a6a87;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
  @media only screen and (max-width: 1200px){
    width: 80%;
  }
  .updateAskingTodo{
    border-radius: 10px;
    background-color: grey;
  }
  &::-webkit-scrollbar {
          width: 0.3rem;
          height: 0.1rem;
          &-thumb{
            background-color: white;
            width: 0rem;
            border-radius: 1em;
          }
        }
  }
  p{
    width: 40%;
    text-align: center;
    color: white;
    background-color: #131324;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    /* height: 30px; */
    word-break: break-word;
    padding: 0.5rem;

  }
  .todoElement{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    width: 80%;
    gap: 1rem;
    transition: 0.8s ease;
    animation: animate 0.8s ease forwards;
    position: relative;
    right: -200px;
    button{
    background-color: #997af0;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 0.8rem;
    text-transform: uppercase;
    &:hover{
      background-color: #4e0eff;
    }
  }
  }
  @keyframes animate {
     0%{
       right: -200px;
     }
     100%{
       right: 0px;
     }
  }
`