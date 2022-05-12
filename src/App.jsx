import React, { useState } from 'react';
import './App.css';
import Login from './components/auth/auth.jsx'
import Game from './components/game';
import {addNewUser, editUserByLogin, getUserByLogin} from './components/firebase/api.tsx'

function App() {
  const [token, setToken] = useState();
  const [isGameStart, setGameStart] = useState();


  function Rules(){
      alert("Rules!")
  }
  function startGame(){
      //addNewUser("test", "test", true).then()
      //console.log(getUserByLogin("test"))
      //console.log(editUserByLogin("test", "12323232", 22223, true))
      setGameStart(true);

  }

  if(!token) {
    return <Login setToken={setToken} />
  }
  
  if(token && !isGameStart){
    return <div><div className='blured'>
            <Game />
            </div><button className='startbtn' onClick={startGame}>Start</button>
          </div>
  }
  
  return (
    <>
        <Game />
    <button style={{"margin-bottom" : "40px", "margin-left" : "40px"}} onClick={Rules}>Правила игры</button>
    </>
  );
}

export default App;


