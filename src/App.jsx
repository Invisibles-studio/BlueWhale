import React, { useState } from 'react';
import './App.css';
import Login from './components/auth/auth.jsx'
import Game from './components/game';
import RulesPng from "./components/images/rules.png"
import {editUserByLogin} from './components/firebase/api.tsx'

function App() {
  const [token, setToken] = useState();
  const [isGameStart, setGameStart] = useState(false);
  const [code, setCode] = useState("");
  const [user, setUser] = useState();

  function Rules(){
      alert("Rules!")
  }
  function startGame(){
      //addNewUser("test", "test", true).then()
      //console.log(getUserByLogin("test"))
      //console.log(editUserByLogin("test", "12323232", 22223, true))
      //console.log(user)
      //editUserByLogin(user.login, code.toString(), Date.now(), false); //типа если не нулл то изменять код и добавить код надо


      setGameStart(true);

  }



  if(!token) {
    return <Login setToken={setToken} setUser={setUser} />
  }
  
  if(token && !isGameStart){
    return <div><div className='blured'>

            </div>
                <form onSubmit={startGame}>
                    <label>
                        <p>Special code</p>
                        <input type="text" onChange={e => setCode(e.target.value)} />
                    </label>
                    <button className='startbtn' type="submit">Start</button>
                </form>


          </div>
  }
  
  return (
    <div className="background" >
        <Game login ={user.login}/>
    <input className="rulesBtn" type="image" src={RulesPng} alt="Login" onClick={Rules}></input>
    </div>
  );
}

export default App;


