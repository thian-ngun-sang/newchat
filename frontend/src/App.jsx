import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';

import Login from './views/Login';
import Register from './views/Register';
import Home from './views/Home';
import Users from "./views/Users";
import PeerAccount from './views/PeerAccount';
import Chat from './views/Chat';
import ChatUsers from './views/ChatUsers';
import Account from './views/Account';
import EditProfile from './views/EditProfile';
import ChangePassword from './views/ChangePassword';
import NotFound from './views/NotFound';

import Authenticate from "./components/Authenticate";
import Authorize from './components/Authorize';
import AppLayout from './components/AppLayout';
import SingleChat from './components/SingleChat';
import SingleStory from './components/SingleStory';

import './App.css';

const token = localStorage.getItem('token');
if(token !== "" && token !== undefined){
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Get to know who the useris */}
          <Route path="/" element={<Authenticate/>}>
            {/* Decide wheter the user is authorized to a particul path */}
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>

            <Route path="/" element={<Authorize/>}>
              <Route path="/account/edit" element={<EditProfile/>}/>
              <Route path="/account/change-password" element={<ChangePassword/>}/>
              <Route path="/" element={<AppLayout/>}>
                <Route index path="/" element={<Home/>}/>
                <Route path="/account" element={<Account/>}/>
                <Route path="/users" element={<Users/>}/>
                <Route path="/user/:id" element={<PeerAccount/>}/>
                <Route path="/chat" element={<Chat/>}/>
                <Route path="/chat-users" element={<ChatUsers/>}/>
                <Route path="/chat/:id" element={<SingleChat/>}/>
                <Route path="/story/:id" element={<SingleStory/>}/>
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<NotFound/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
