/* eslint-disable */
import {useEffect, useState} from "react";
import {getUserByLogin} from "./firebase/api";

let settingsSlidesText = []
const Adminpanel = () => {

  const [slidesCount, setSlidedCount] = useState(2);



  useEffect(()=>{
    const fetchData = async () => {
      document.querySelector<HTMLInputElement>("#slidesCount").value = String(2); // default value for slidesCount
    }
    fetchData();
  }, [])

  return (
      <div style={{"color":"white"}}>
      <div className="rightMenu" >
        <div className="rulesSettings">
          <p>Slides count</p>
          <input type="number" id="slidesCount" />
        </div>
      </div>
      </div>)

}

export {Adminpanel};