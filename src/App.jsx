/* eslint-disable */
import React, { useState } from 'react';
import './App.css';
import Login from './components/auth/auth.jsx'
import Game from './components/game.jsx';
import {editUserByLogin, getUserByLogin} from './components/firebase/api.tsx'

import {Adminpanel} from "./components/adminpanel.tsx"

import {Routes, Route, Link} from 'react-router-dom'
function App() {
  const [token, setToken] = useState();
  const [user, SetUser] = useState({});


  return (<>
      <div className="background">

          <Routes>
              <Route path="/admin-control" element={<Adminpanel/>}/>
              <Route path="/" element={<Login setToken={setToken} SetUser={SetUser} />}/>
              <Route path="/game" element={<Game user={user}/>} />
          </Routes>

      </div>

      </>);

  if(!token) {
    return <Login setToken={setToken} SetUser={SetUser} />
  }


 /* return (
      <>
    <div className="background" >
      <Game  user={user}/></div>
      </>

  );*/
}


export default App;


