/* eslint-disable */

import {useNavigate} from "react-router-dom";

export default function Signout(){
    localStorage.clear()

    const navigate = useNavigate()

    function GoToLogin(){
        return navigate("/")
    }

    return <div>

        <p className="gameRadarTitle">RADAR</p>
        <p className="gameSignOutText">Successful Sign out</p>

        <input type="button" className="gameSignOutButton" onClick={GoToLogin} value="Go to Log in"/>

    </div>
}