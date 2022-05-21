/* eslint-disable */
import React, { useState } from 'react';
import RulesPng from "./images/rules.png";
const EllipseAdmin = (props) => {

    // console.log(props.stage)
    var classes = ["stagefour", "stagethree", "stagetwo", "stageone"];
    var ids = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eight"];
    var ellipses = [];
    for(var i = 0; i< classes.length;i++){
        for(var j = 0; j< ids.length; j++)
        {

            /* if (j >= props.circlesInfo.stagefour && i === 0) break;
             if (j >= props.circlesInfo.stagethree && i === 1) break;
             if (j >= props.circlesInfo.stagetwo && i == 2) break*/
            if (j === 1 && i === 3) break;
            if (j === 2 && i === 2) break;
            if (j === 4 && i === 1) break;
            if(classes[i] === props.stage && j === 0){
                ellipses.push(<div key={i+" "+j} className={"gameEllipse " + classes[i] + " myPos"} id={ids[j]}></div>);
                continue;
            }else{
                ellipses.push(<div key={i+" "+j} className={"gameEllipse " + classes[i]} id={ids[j]}></div>)}
        }
    }

    return ellipses;
}


export default function Admin(){

    const [textId, setTextId] = useState("")
    const [textValue, setTextValue] = useState()
    const [circlesInfo, setCirclesInfo] = useState( {
        stage: "stagefour",
        stagefour: 8,
        stagethree: 4,
        stagetwo: 2,
        stageone: 1
    });

    function changeText() {
        let textId = document.querySelector("#textId").value;
        let textnameId = "";
        if (textId == 2) textnameId = "position";
        else if (textId == 1) textnameId = "stage";
        else if (textId == 3) textnameId = "personal-code";
        else if(textId == 4) textnameId = "upper-code";
        let text = document.querySelector("#txtarea").value;
        document.querySelector("#" + textnameId).innerHTML = text;
    }
    function enableCircle(){
        let pos = document.querySelector("#position-idE").value;
        let circle = document.querySelector("#circle-idE").value;
        try{
            document.querySelector("."+pos+"#"+circle).classList.remove("hidden");
        }catch (e) {alert("wrong circle")}
    }
    function disableCircle(){
        let pos = document.querySelector("#position-idD").value;
        let circle = document.querySelector("#circle-idD").value;
        try{
            document.querySelector("."+pos+"#"+circle).classList.add("hidden");
        }catch (e) {alert("wrong circle")}
        //document.querySelector(name).classList.add("hidden")
    }

    function SelectCircle(){
        let pos = document.querySelector("#position-id").value;
        let circle = document.querySelector("#circle-id").value;
        console.log(circle)
        try{document.querySelector(".myPos").classList.remove("myPos");}
        catch (e) {}
        try{
            document.querySelector("."+pos+"#"+circle).classList.add("myPos");
        }catch (e) {alert("wrong circle")}
    }

    function getCheckCode(){
        if (user.checkState === true){ return;}
        document.querySelector(".gameWindow").classList.add("gameBlur")
        document.querySelector(".gameStartCircle").classList.remove("hidden")
        document.querySelector(".gameStartCircle").addEventListener("click", changeCheckState)
        document.getElementById("startTextbtn").innerHTML = "Code";
        document.getElementById("personalCodeStart").value = ""

    }

    function changeCheckState(){
        let code = document.getElementById("personalCodeStart").value
        if (code === "") return;
        document.querySelector(".gameWindow").classList.remove("gameBlur")
        document.querySelector(".gameStartCircle").classList.add("hidden")
    }


    function copyTheCode(){
        navigator.clipboard.writeText(document.getElementById("personal-code").textContent)
    }

    return <div className="window">

        <div className="gameWindow">
            <p className="gameRadarTitle">RADAR</p>
            <div className="gameRadarW"><div className="radarImage" id="radarWindow"><EllipseAdmin circlesInfo={circlesInfo}/></div></div>
            <p className="gameCodeBlockLabel">Code:</p>
            <div className="gameCodeBlock"><p id="upper-code">dnvn1g3g9mcsx1dv</p></div>
            <div className="gameLeftBlock">
                <div className="gameLeftBlockTop stage" ><p id="stage">STAGE 4</p></div>
                <div className="gameLeftBlockMiddle position"><p id="position">POSITION 4</p></div>
                <div className="gameLeftBlockButton codeleft" onClick={test => {console.log("TEST")}}><p id="personal-code">MY CODE</p></div>
            </div>
            <div className="gameRightBlock">
                <div className="gameRightBlockTop" onClick={getCheckCode}><p>COPY THE CODE</p></div>
                <div className="gameRightBlockBottom" onClick={()=>{}}><p id="checkbtnText">CHECK</p></div>

            </div>
            <input className="rulesBtn" type="image" alt="Rules" src={RulesPng} />
        </div>

        <div className="gameStartCircle hidden" onClick={changeCheckState}>
            <p id="startTextbtn">START</p>
            <input className="gamePersonalCode" id="personalCodeStart" type="text" placeholder="Code"/>
        </div>
        <div>ADMIN PANEL</div>
        <div className="admin-panel" style={{"display" : "flex"}}>
            <div id="text-changer">
                <p><b>Change text</b></p>
                <select id="textId" >
                    <option value="1">Stage text</option>
                    <option value="2">Position text</option>
                    <option value="3">Code left</option>
                    <option value="4">Upper code</option>
                </select>
                <div>
                <textarea placeholder="type text here" id="txtarea"></textarea>
                </div>
                <div>
                    <button type="submit" onClick={changeText}>Change</button>
                </div>
            </div>
            <div id="setPosition" style={{"marginLeft" : "5vw"}}>
                <p><b>Select stage</b></p>
                <select id="position-id" >
                    <option value="stagefour">Position 4</option>
                    <option value="stagethree">Position 3</option>
                    <option value="stagetwo">Position 2</option>
                    <option value="stageone">Position 1</option>
                </select>
                <select id="circle-id">
                    <option value="first">Circle 1</option>
                    <option value="second">Circle 2</option>
                    <option value="third">Circle 3</option>
                    <option value="fourth">Circle 4</option>
                    <option value="fifth">Circle 5</option>
                    <option value="sixth">Circle 6</option>
                    <option value="seventh">Circle 7</option>
                    <option value="eight">Circle 8</option>
                </select>
                <div>
                    <button type="submit" onClick={SelectCircle}>Select</button>
                </div>
            </div>
            <div id="disableCircle" style={{"marginLeft" : "5vw"}}>
                <p><b>Disable circle</b></p>
                <select id="position-idD" >
                    <option value="stagefour">Position 4</option>
                    <option value="stagethree">Position 3</option>
                    <option value="stagetwo">Position 2</option>
                    <option value="stageone">Position 1</option>
                </select>
                <select id="circle-idD">
                    <option value="first">Circle 1</option>
                    <option value="second">Circle 2</option>
                    <option value="third">Circle 3</option>
                    <option value="fourth">Circle 4</option>
                    <option value="fifth">Circle 5</option>
                    <option value="sixth">Circle 6</option>
                    <option value="seventh">Circle 7</option>
                    <option value="eight">Circle 8</option>
                </select>
                <div>
                    <button type="submit" onClick={disableCircle}>Disable</button>
                </div>
            </div>
            <div id="enableCircle" style={{"marginLeft" : "5vw"}}>
                <p><b>Enable circle</b></p>
                <select id="position-idE" >
                    <option value="stagefour">Position 4</option>
                    <option value="stagethree">Position 3</option>
                    <option value="stagetwo">Position 2</option>
                    <option value="stageone">Position 1</option>
                </select>
                <select id="circle-idE">
                    <option value="first">Circle 1</option>
                    <option value="second">Circle 2</option>
                    <option value="third">Circle 3</option>
                    <option value="fourth">Circle 4</option>
                    <option value="fifth">Circle 5</option>
                    <option value="sixth">Circle 6</option>
                    <option value="seventh">Circle 7</option>
                    <option value="eight">Circle 8</option>
                </select>
                <div>
                    <button type="submit" onClick={enableCircle}>Enable</button>
                </div>
            </div>
        </div>

    </div>
}
