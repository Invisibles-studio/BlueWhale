/* eslint-disable */
import {useEffect, useState} from "react";
import {getUserByLogin} from "./firebase/api";

let settingsSlidesText = []
let currentSlide = 0;
const Adminpanel = () => {

  const [slidesCount, setSlidedCount] = useState(2);

  function changeSlide(e){
      console.log(e.target.id)
      let totalSlides = parseInt(document.querySelector<HTMLInputElement>("#slidesCount").value) - 1 ;
      let text = document.querySelector<HTMLInputElement>("#slideText").value;
      let id = e.target.id;

      if (id === "getNextSlide"){
          if(currentSlide == totalSlides){
              settingsSlidesText[currentSlide] = text;
          }else{
              settingsSlidesText[currentSlide] = text;
              currentSlide++;
              if(settingsSlidesText[currentSlide] == undefined){
                  document.querySelector<HTMLInputElement>("#slideText").value = ""
              }else
              document.querySelector<HTMLInputElement>("#slideText").value = settingsSlidesText[currentSlide];
          }
      }else if(id ==="getPreviousSlide"){
          if(currentSlide == 0){
              settingsSlidesText[currentSlide] = text;
          }else{
              settingsSlidesText[currentSlide] = text;
              currentSlide--;
              if(settingsSlidesText[currentSlide] == undefined){
                  document.querySelector<HTMLInputElement>("#slideText").value = ""
              }else
                  document.querySelector<HTMLInputElement>("#slideText").value = settingsSlidesText[currentSlide]
          }
      }
      document.querySelector<HTMLInputElement>("#currentSlide").innerHTML = currentSlide.toString();

      console.log(settingsSlidesText)
  }

  function confirmSettingsText() {
      let totalSlides = parseInt(document.querySelector<HTMLInputElement>("#slidesCount").value) - 1
      let text = document.querySelector<HTMLInputElement>("#slideText").value;
     settingsSlidesText[currentSlide] = text;
     for(let i = currentSlide; i<totalSlides;i++){
         let text = document.querySelector<HTMLInputElement>("#slideText").value;
         if(settingsSlidesText[i] == undefined) settingsSlidesText[i] = "";
     }
     console.log(settingsSlidesText)

  }


  useEffect(()=>{
    const fetchData = async () => {
      document.querySelector<HTMLInputElement>("#slidesCount").value = String(2); // default value for slidesCount
    }
    fetchData();
  }, [])




    return (
      <div style={{"color":"white"}}>

        <div className="rulesSettings">
            <h1>Rules settings</h1>
            <p>Slides count</p>
            <input type="number" id="slidesCount" />
            <input type="submit" id="getPreviousSlide" value="Previous slide" onClick={changeSlide}/>
            <input type="text" id="slideText"  placeholder="type text for slide here"/>
            <input type="submit" id="getNextSlide" value="Next slide" onClick={changeSlide}/>
            <input type="submit"  value="Confirm all" onClick={confirmSettingsText}/>
            <p id="currentSlide">0</p>
        </div>

      </div>)

}

export {Adminpanel};