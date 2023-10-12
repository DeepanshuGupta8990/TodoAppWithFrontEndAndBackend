import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Singup from './pagesForApp/Singup';
import Login from './pagesForApp/Login';
import Home from './pagesForApp/Home';

function App() {
  return (
     <BrowserRouter>
    <div className="App">
       <Routes>
        <Route path='/home' element={<Home/>}></Route>
        <Route path='/' element={<Singup/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
       </Routes>
    </div>
     </BrowserRouter>
  );
}

export default App;
