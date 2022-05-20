/* eslint-disable */
import React, { useState } from 'react';
import './App.css';
import Login from './components/auth/auth.jsx'
import Game from './components/game.jsx';
import {editUserByLogin, getUserByLogin} from './components/firebase/api.tsx'

function App() {
  const [token, setToken] = useState();
  const [isGameStart, setGameStart] = useState(false);
  const [code, setCode] = useState("");
  const [user, SetUser] = useState({});

  function Rules(){
      alert("Rules!")
  }
  function getTime(){
        return Date.now()+10800000;
    }
  function startGame(){
      getUserByLogin(user.login).then((_user)=>{
          if(_user.stage === ""){
              editUserByLogin(user.login, "stagefour", getTime(), false).then((json)=>{
                  SetUser(json)
              });


          }
      })
      setGameStart(true);

  }



  if(!token) {
    return <Login setToken={setToken} SetUser={SetUser} />
  }

  if(user.stage === "" || user===undefined){
      return(<div>wait</div>)
  }
  return (
    <div className="background" >
        <Game  user={user}/>
    </div>
  );
}

export default App;


