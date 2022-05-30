/* eslint-disable */
import React, { useState } from 'react';
import './App.css';
import Login from './components/auth/auth.jsx'
import Game from './components/game.jsx';
import {editUserByLogin, getUserByLogin} from './components/firebase/api.tsx'

import {Adminpanel} from "./components/adminpanel.tsx"

import {Routes, Route, Link, useNavigate, Redirect} from 'react-router-dom'
import * as PropTypes from "prop-types";
import Signout from "./components/Signout.tsx";

function Navigate(props) {
    return null;
}

Navigate.propTypes = {
    to: PropTypes.string,
    children: PropTypes.node
};

function App() {
  const [token, setToken] = useState();
  const [user, SetUser] = useState({});


  return (<>
      <div className="background">

          <Routes>

              <Route path="/" element={<Login setToken={setToken} SetUser={SetUser} />}/>
              {localStorage.getItem("userLogin") !== null &&

              <Route path="/game" element={<Game user={user}/>} />

              }
              {localStorage.getItem("userLogin") !== null &&


                      <Route path="/admin-control" element={<Adminpanel/>}/>

              }
              <Route path="/signout" element={<Signout />}/>
              <Route path="*" element={<Login setToken={setToken} SetUser={SetUser} />}/>
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


