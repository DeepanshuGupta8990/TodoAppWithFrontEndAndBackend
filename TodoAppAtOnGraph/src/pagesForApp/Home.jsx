import axios from "axios";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import LoadingImage from "../image/loading.gif";
import Skeleton from "@mui/material/Skeleton";
import Tooltip from "@mui/material/Tooltip";
import { AiOutlineLogout } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "@mui/material/Modal";
import { Button, Stack, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { useSelector, useDispatch } from "react-redux";
import { updateTodos } from "../features/todos/todoSlice";
import { useGetJsonQuery } from "../apis/api";
import { useGetAllTodosMutation } from "../apis/api";
import { useAddTodoMutation } from "../apis/api";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ContentCopy from "@mui/icons-material/ContentCopy";
import UndoIcon from "@mui/icons-material/Undo";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth0 } from "@auth0/auth0-react";

const screenWidth = window.innerWidth;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: (screenWidth * 40) / 100,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function Home() {
  const { user,logout  } = useAuth0();
  const [createJson] = useGetAllTodosMutation();
  const [createJson1] = useAddTodoMutation();
  const navigate = useNavigate();
  const uniqueId = uuidv4();
  const inputRef = useRef(null);
  const [todo, setTodo] = useState("");
  const [todoArray, setTodoArray] = useState([]);
  const [updateButtonActive, setUpdateButtonActive] = useState(false);
  const [todoId, setTodoId] = useState(null);
  const [animationDelay, setAnimationDelay] = useState(true);
  const [loadingAniamtion, setLoadingAnimation] = useState(false);
  const todoListRef = useRef(null);
  const skeltenArray = [1, 2, 3, 4, 5, 6];
  const [dataArrived, setDataArrived] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);
  const todos1 = useSelector((state) => state.todos);
  const dispatch = useDispatch();
  let userInfo;
  // const scrollBarToBottom = useRef(false)
  // console.log(todos1, "todos1");

  const toastOptions = {
    position: "top-right",
    autoClose: "8000",
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

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

  async function updateTodosFunc() {
    try {
      setUpdateButtonActive(false);
      setTodoId(null);
      setLoadingAnimation(true);
      const updateRequiredTodo = todoArray.find((todo) => {
        return todo.todoid === todoId;
      });
      const lastTodo = updateRequiredTodo.todo;
      const oneMinusTodoArray = todoArray.filter((todo) => {
        return todo.todoid !== todoId;
      });
      const todoArray2 = [
        ...oneMinusTodoArray,
        {
          ...updateRequiredTodo,
          todo: todo,
          update: true,
          updatedAt: Date.now(),
          lastTodo: lastTodo,
        },
      ];
      const data = await axios.post("https://websocketchatapp.tanujagupta.repl.co/updateTodo", {
        todoArray: todoArray2,
        email: userInfo.email,
        password: userInfo.password,
      });
      if (data.data.status === 200) {
        const currentDate = new Date();
        const sortedTodoArray = data.data.todosArray.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          const timeDifferenceA = Math.abs(currentDate - dateA);
          const timeDifferenceB = Math.abs(currentDate - dateB);
          return timeDifferenceA - timeDifferenceB; // To sort in ascending order
        });
        setTodoArray(sortedTodoArray);
        dispatch(updateTodos(sortedTodoArray));
        setTodo("");
      } else {
        console.log("err arrived");
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setTimeout(() => {
        setLoadingAnimation(false);
      }, 400);
    }
  }

  async function undoFunc(id){
    try {
      setUpdateButtonActive(false);
      setTodoId(null);
      setLoadingAnimation(true);
      console.log(id)
      const updateRequiredTodo = todoArray.find((todo) => {
        return todo.todoid === id;
      });
      const requiredTodo = updateRequiredTodo.lastTodo;
      const oneMinusTodoArray = todoArray.filter((todo) => {
        return todo.todoid !== id;
      });
      const todoArray2 = [
        ...oneMinusTodoArray,
        {
          ...updateRequiredTodo,
          todo: requiredTodo,
          update: false,
          lastTodo:undefined
        },
      ];
      const data = await axios.post("https://websocketchatapp.tanujagupta.repl.co/updateTodo", {
        todoArray: todoArray2,
        email: userInfo.email,
        password: userInfo.password,
      });
      if (data.data.status === 200) {
        const currentDate = new Date();
        const sortedTodoArray = data.data.todosArray.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          const timeDifferenceA = Math.abs(currentDate - dateA);
          const timeDifferenceB = Math.abs(currentDate - dateB);
          return timeDifferenceA - timeDifferenceB; // To sort in ascending order
        });
        setTodoArray(sortedTodoArray);
        dispatch(updateTodos(sortedTodoArray));
      } else {
        console.log("err arrived");
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setTimeout(() => {
        setLoadingAnimation(false);
      }, 400);
    }
  }

  async function keyDownFunc(e) {
    try {
      if (e.key === "Enter" || e.keyCode === 13) {
        if (todo !== "" && updateButtonActive === false) {
          setLoadingAnimation(true);
          setUpdateButtonActive(false);
          const newTodoArray = [
            ...todoArray,
            { todo: todo, todoid: uniqueId, date: new Date() },
          ];
          // const { data } = await axios.post("https://websocketchatapp.tanujagupta.repl.co/add", {
          //   todoArray: newTodoArray,
          //   email: userInfo.email,
          //   password: userInfo.password,
          // });
          const {data} = await createJson1({
            todoArray: newTodoArray,
            email: userInfo?.email,
            password: userInfo?.password,
          });
          if (data.status === 201) {
            const currentDate = new Date();
            const sortedTodoArray = [...data.todosArray].sort((a, b) => {
              const dateA = new Date(a.date);
              const dateB = new Date(b.date);
              const timeDifferenceA = Math.abs(currentDate - dateA);
              const timeDifferenceB = Math.abs(currentDate - dateB);
              return timeDifferenceA - timeDifferenceB; // To sort in ascending order
            });
            setTodoArray(sortedTodoArray);
            dispatch(updateTodos(sortedTodoArray));
            setTodo("");
            // scrollBarToBottom.current = true;
          }
        } else if (todo !== "" && updateButtonActive === true) {
          setLoadingAnimation(true);
          updateTodosFunc();
        }
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setTimeout(() => {
        setLoadingAnimation(false);
      }, 400);
    }
  }
  async function cancelFunc() {
    setTodo("");
    setUpdateButtonActive(false);
    setTodoId(null);
  }
  async function addTodoFunc() {
    try {
      if (todo.length > 1) {
        setUpdateButtonActive(false);
        setLoadingAnimation(true);
        const newTodoArray = [
          ...todoArray,
          { todo: todo, todoid: uniqueId, date: new Date() },
        ];
        // const { data } = await axios.post("https://websocketchatapp.tanujagupta.repl.co/add", {
        //   todoArray: newTodoArray,
        //   email: userInfo.email,
        //   password: userInfo.password,
        // });
        const {data} = await createJson1({
          todoArray: newTodoArray,
          email: userInfo?.email,
          password: userInfo?.password,
        });
        console.log(data)
        if (data.status === 201) {
          const currentDate = new Date();
          const sortedTodoArray = [...data.todosArray].sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            const timeDifferenceA = Math.abs(currentDate - dateA);
            const timeDifferenceB = Math.abs(currentDate - dateB);
            return timeDifferenceA - timeDifferenceB; // To sort in ascending order
          });
          setTodoArray(sortedTodoArray);
          dispatch(updateTodos(sortedTodoArray));
          setTodo("");
          // scrollBarToBottom.current = true;
        }
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setTimeout(() => {
        setLoadingAnimation(false);
      }, 400);
    }
  }
  function updateFunc(todoElement) {
    setTodo(todoElement.todo);
    setUpdateButtonActive(true);
    setTodoId(todoElement.todoid);
    inputRef.current.focus();
  }
  async function removeFunc(todoElement) {
    try {
      if (todoElement.todoid === todoId) {
        setUpdateButtonActive(false);
        setTodo("");
      }
      setTodoId(null);
      setLoadingAnimation(true);
      const newTodoArray = todoArray.filter((todo) => {
        return todo.todoid !== todoElement.todoid;
      });
      const { data } = await axios.post("https://websocketchatapp.tanujagupta.repl.co/deleteTodo", {
        todoArray: newTodoArray,
        email: userInfo.email,
        password: userInfo.password,
      });
      if (data.status === 200) {
        setTodoArray(newTodoArray);
        dispatch(updateTodos(newTodoArray));
      } else {
        console.log("err arrived");
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoadingAnimation(false);
    }
  }

  const logout1 = () => {
    localStorage.removeItem("OnGraphTodoApp");
    logout()
    toast.success("Logout succesfully", toastOptions);
    // setTimeout(() => {
    //   navigate("/login", { replace: true });
    // }, 500);
  };

  const closeDailog = () => {
    setOpenModal(false);
  };

  const rqFunc = async (email, password) => {
    try {
      const response = await createJson({
        email: email,
        password: password,
      });
      return response.data.todosArray;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  useEffect(() => {
    console.log(user,userInfo,'user.....')
    try {
      async function func() {
        // inputRef.current.focus();
        // const data = await axios.post("https://websocketchatapp.tanujagupta.repl.co/getTodos", {
        //   email: userInfo?.email,
        //   password: userInfo?.password,
        // });
        let response;
        if (userInfo?.password) {
          response = await createJson({
            email: userInfo?.email,
            password: userInfo?.password,
          });
        }
        console.log(response)
        if (response) {
          const currentDate = new Date();
            const sortedTodoArray = [...response.data.todosArray].sort((a, b) => {
              // const sortedTodoArray = data.data.todosArray.sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                const timeDifferenceA = Math.abs(currentDate - dateA);
                const timeDifferenceB = Math.abs(currentDate - dateB);
                return timeDifferenceA - timeDifferenceB; // To sort in ascending order
              });
              setTimeout(() => {
                setTodoArray(sortedTodoArray);
                dispatch(updateTodos(sortedTodoArray));
                setDataArrived(true);
              }, 500);
              setTimeout(() => {
                setAnimationDelay(false);
              }, 1000);
            setTimeout(()=>{
              setDataArrived(true);
            },500)
        } else {
          navigate("/login");
        }
      }
      func();
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  // useEffect(()=>{
  //   if (todoListRef.current && scrollBarToBottom.current) {
  //     todoListRef.current.scrollTop = todoListRef.current.scrollHeight;
  //     scrollBarToBottom.current = false;
  //   }
  // },[todoArray])
  console.log(userInfo,'userinfo')
  return (
    <Container>
      <div id="chatsLink">
        <Link to='/chat'>Go to chats1</Link>
      </div>
      <div id="chatsLink2">
        <Link to='/socketChatApp'>Go to chats2</Link>
      </div>
      {loadingAniamtion && (
        <div id="loadingdiv">
          <img src={LoadingImage} alt="ddsd" height={34.5} />
        </div>
      )}
      <div id="logout" onClick={handleOpen}>
        <Tooltip title="Logout">
          <span>
            <AiOutlineLogout
              style={{ fontSize: "18px", color: "white", fontSize: "30px" }}
            />
          </span>
        </Tooltip>
      </div>
      <Dialog
        open={openModal}
        onClose={closeDailog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Logout"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure that you want to logout
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDailog}>cancel</Button>
          <Button onClick={logout1} autoFocus>
            yes
          </Button>
        </DialogActions>
      </Dialog>
      <div id="inputCont">
        <input
          ref={inputRef}
          type="text"
          placeholder="Write you todo here"
          value={todo}
          onChange={(e) => {
            setTodo(e.target.value);
          }}
          onKeyDown={(e) => {
            keyDownFunc(e);
          }}
        />
        {updateButtonActive ? (
          <button onClick={updateTodosFunc}>Update</button>
        ) : (
          <button type="submit" onClick={addTodoFunc}>
            Add
          </button>
        )}
      </div>
      <div id="todoList" ref={todoListRef}>
        {todos1.map((todoElement, index) => {
          return (
            <div
              key={todoElement.todoid}
              className={`${
                todoElement.todoid === todoId ? "updateAskingTodo" : ""
              } todoElement`}
              style={{ animationDelay: `${animationDelay ? index * 0.1 : 0}s` }}
            >
              {todoElement.update && <SimplePopper todoElement={todoElement} />}

              <ToolTipComponent
                todoElement={todoElement}
                removeFunction={removeFunc}
                undoFunction={undoFunc}
              />
              <div
                style={{ display: "flex", flexDirection: "row", gap: "0.5rem" }}
              >
                <button
                  onClick={() => {
                    removeFunc(todoElement);
                  }}
                >
                  Remove
                </button>
                {todoElement.todoid === todoId ? (
                  <button onClick={cancelFunc}>Cancel</button>
                ) : (
                  <button
                    onClick={() => {
                      updateFunc(todoElement);
                    }}
                  >
                    Update
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {todoArray.length < 1 && dataArrived ? (
          <h3>No todos made yet 😅</h3>
        ) : (
          ""
        )}
        {!dataArrived && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            {skeltenArray.map((skeleton) => {
              return <SkeletenComponent />;
            })}
          </div>
        )}
      </div>
    </Container>
  );
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
  #chatsLink{
    position: absolute;
    top: 10px;
    left: 10px;
    font-size: 20px;
  }
  #chatsLink2{
    position: absolute;
    top: 10px;
    left: 150px;
    font-size: 20px;
  }
  #logout {
    padding: 5px;
    background-color: #997af0;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border-radius: 6px;
    transition: 0.5s ease;
    position: absolute;
    top: 20px;
    right: 20px;
    &:hover {
      background-color: #4e0eff;
    }
    &:active {
      transform: scale(0.9);
    }
  }
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
  #inputCont {
    width: 40%;
    height: 20%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    gap: 1rem;
    @media only screen and (max-width: 1200px) {
      flex-direction: column;
      width: 80%;
    }
    button {
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
      &:hover {
        background-color: #4e0eff;
      }
    }
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    transition: border 0.5s ease;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  #todoList {
    width: 40%;
    height: 60%;
    background-color: #6a6a87;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 1rem;
    padding-top: 1rem;
    @media only screen and (max-width: 1200px) {
      width: 80%;
      gap: 0.8rem;
    }
    .updateAskingTodo {
      border-radius: 10px;
      background-color: grey;
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
  .pTag {
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
    @media only screen and (max-width: 600px) {
      width: 80%;
    }
  }
  .todoElement {
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
    @media only screen and (max-width: 600px) {
      flex-direction: column;
      gap: 0rem;
      position: relative;
    }
    button {
      background-color: #997af0;
      color: white;
      padding: 0.5rem 1rem;
      border: none;
      font-weight: bold;
      cursor: pointer;
      border-radius: 0.4rem;
      font-size: 0.8rem;
      text-transform: uppercase;
      &:hover {
        background-color: #4e0eff;
      }
    }
  }
  @keyframes animate {
    0% {
      right: -200px;
    }
    100% {
      right: 0px;
    }
  }
  .tooltip {
    @media only screen and (max-width: 600px) {
      left: -100px;
    }
  }
`;

const SkeletenComponent = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      <Skeleton
        className="custom-skeleton1" // Apply a CSS class
        variant="rectangular"
        height={40}
      />
      <Skeleton
        className="custom-skeleton2" // Apply a CSS class
        variant="rectangular"
        height={30}
      />
      <Skeleton
        className="custom-skeleton3" // Apply a CSS class
        variant="rectangular"
        height={30}
      />
    </div>
  );
};

function SimplePopper({ todoElement }) {
  const utcDateString = `${todoElement.updatedAt}`;
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

  // Convert the UTC date to IST
  const istDate = utcDate.toLocaleString("en-IN", istOptions);
  return (
    <div
      className="tooltip"
      style={{ position: "absolute", top: "-6px", left: "7%" }}
    >
      <Tooltip title={`Updated At ${istDate}`}>
        <p
          className="pTag"
          style={{ width: "6px", height: "6px", background: "#b435cb" }}
        >
          U
        </p>
      </Tooltip>
    </div>
  );
}

const ToolTipComponent = ({ todoElement, removeFunction,undoFunction }) => {
  const utcDateString = `${todoElement.date}`;
  const utcDate = new Date(utcDateString);
  const pRef = useRef(null);

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

  // Convert the UTC date to IST
  const istDate = utcDate.toLocaleString("en-IN", istOptions);

  return (
    <>
      <Tooltip title={`Created At ${istDate.toLocaleString()}`}>
        <p ref={pRef} className="pTag">
          {todoElement.todo}
        </p>
      </Tooltip>
      <div>
        <ContextMenu
          refrenceOfP={pRef}
          todoElement={todoElement}
          removeFunction={removeFunction}
          undoFunction={undoFunction}
        />
      </div>
    </>
  );
};

const ContextMenu = ({ refrenceOfP, todoElement, removeFunction,undoFunction }) => {
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    top: 0,
    left: 0,
  });

  function copyTextToClipboard(text) {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          console.log("Text copied to clipboard:", text);
        })
        .catch((err) => {
          console.error("Unable to copy text to clipboard:", err);
        });
    } else {
      console.error("Clipboard API not supported in this browser.");
    }
  }

  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenuPosition({ top: e.clientY, left: e.clientX });
    setContextMenuVisible(true);
  };
  const handleCloseContextMenu = () => {
    setContextMenuVisible(false);
  };

  const handleMenuItemClick = () => {
    copyTextToClipboard(todoElement.todo);
    handleCloseContextMenu();
  };

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
    window.addEventListener("scroll", handleCloseContextMenu);
    refrenceOfP.current.addEventListener("contextmenu", handleContextMenu);
    refrenceOfP.current.addEventListener("click", handleClick);

    return () => {
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

            <MenuItem
              onClick={() => {
                removeFunction(todoElement);
              }}
            >
              <ListItemIcon>
                <DeleteIcon fontSize="small" /> {/* Use the DeleteIcon here */}
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>

           {
            todoElement.lastTodo
            &&  
            <MenuItem onClick={()=>{undoFunction(todoElement.todoid)}}>
            <ListItemIcon>
              <UndoIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Undo</ListItemText>
          </MenuItem>
           }

          </MenuList>
        </Paper>
      )}
    </>
  );
};
