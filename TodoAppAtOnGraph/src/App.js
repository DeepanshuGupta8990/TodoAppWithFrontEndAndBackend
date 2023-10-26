import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Singup from './pagesForApp/Singup';
import Login from './pagesForApp/Login';
import Home from './pagesForApp/Home';
import Chat from './pagesForApp/Chat';
import Chat2 from './pagesForApp/Chat2';
import SocketChatApp from './pagesForApp/SocketChatApp';
import ChangeDp from './pagesForApp/ChangeDp';

function App() {
  return (
     <BrowserRouter>
    <div className="App">
       <Routes>
        <Route path='/home' element={<Home/>}></Route>
        <Route path='/' element={<Singup/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/chat' element={<Chat/>}></Route>
        <Route path='/chat2' element={<Chat2/>}></Route>
        <Route path='/socketChatApp' element={<SocketChatApp/>}></Route>
        <Route path='/changeDp' element={<ChangeDp/>}></Route>
       </Routes>
    </div>
     </BrowserRouter>
  );
}

export default App;
