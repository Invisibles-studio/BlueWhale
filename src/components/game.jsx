/* eslint-disable */
import leftBg from "./images/leftbg.svg"
import {editUserByLogin, getUserByLogin} from "./firebase/api.tsx";
import {useEffect, useState} from "react";
import Admin from "./Admin";
import "./NewDesign/game.css"
import RulesPng from "./images/rules.png"

export default function Game({ user}){

    const [gameUser, setGameUser] = useState(null);
    const [circlesInfo, setCirclesInfo] = useState( {
        stage: "stagefour",
        stagefour: 8,
        stagethree: 4,
        stagetwo: 2,
        stageone: 1
    });
    const [checkPressed, SetCheckPressed] = useState(false)
    const [isAdmin, setAdmin] = useState(false);
    const [stage, setStage] = useState();

    function copyTheCode(){
        navigator.clipboard.writeText(document.getElementById("personal-code").textContent)
    }
    function getTime(){
        return Date.now()+10800000;
        //return Date.now()
    }

    function startGame(){
        let code = document.getElementById("personalCodeStart").value
        if (code === "") return;
        getUserByLogin(user.login).then((_user)=>{
            if(_user.stage === ""){

                editUserByLogin(user.login, "stagefour", getTime(), false, 0,  code)
            }
        })
        document.querySelector(".gameWindow").classList.remove("gameBlur")
        document.querySelector(".gameStartCircle").classList.add("hidden")
        document.querySelector(".gameRightBlockBottom").addEventListener("click", getCheckCode)
        document.getElementById("personalCodeStart").value = ""
    }


    function getCheckCode(){
        if (checkPressed) return;
        if (user.checkState === true){ return;}
        document.querySelector(".gameWindow").classList.add("gameBlur")
        document.querySelector(".gameStartCircle").classList.remove("hidden")
        document.querySelector(".gameStartCircle").addEventListener("click", changeCheckState)
        document.getElementById("startTextbtn").innerHTML = "Code";

    }

    function changeCheckState(){
        let code = document.getElementById("personalCodeStart").value
        if (code === "") return;
        editUserByLogin(user.login, "", 1, true, getTime(), code)
        SetCheckPressed(true);
        document.querySelector(".gameRightBlockBottom").removeEventListener("click", getCheckCode, false)
    }


    function Check(gameUser){
        if(gameUser == undefined) return;
        if (gameUser.lastUpdate === 1){
            return {
                stage: "stagefour",
                stagefour: 8,
                stagethree: 4,
                stagetwo: 2,
                stageone: 1
            }
        }
        if (gameUser.lastUpdate !== 1){
            let date = gameUser.lastUpdate;
            let st = gameUser.stage;
            let interval = (getTime() - date)/1000;
            interval = Math.round(interval / 60 );
            let kol= 0;
            let fullDaysGone = Math.floor(interval  /1440);
            let checkState = gameUser.checkState
            if(st =="stagefour" && interval < 90){
                return {
                    stage: st,
                    stagefour: 2,
                    stagethree: 4,
                    stagetwo: 2,
                    stageone: 1
                }
            }
            else if (st === "stagefour"){
                let workMinutesPreviousDays = fullDaysGone*840; // 840 - количество рабочих часов в минутах
                //console.log(workMinutesPreviousDays /60 + "workHoursPrevious")
                let todayWorkMinutes = (interval % 1440) - 840; // 36.. то 10 часов в минутах
                if(todayWorkMinutes <0) {
                    if ((getTime()/1000/60%1440)/60 > 10){
                        todayWorkMinutes = interval;
                    }else{
                    todayWorkMinutes=0;}
                }
                else if((getTime()/1000/60%1440)/60 > 20) {
                    todayWorkMinutes = todayWorkMinutes - (getTime()/1000/60%1440- 20*60);
                    console.log(todayWorkMinutes)
                }
                console.log(todayWorkMinutes)
                //console.log("today " + todayWorkMinutes); // будет работать только на следующий день после регистрации. // или нормально
                let kolForLastIcon = workMinutesPreviousDays/90 + 2;
                if (kolForLastIcon<2) kolForLastIcon=2;
                kolForLastIcon += todayWorkMinutes/90;
                kol = Math.floor(workMinutesPreviousDays/90 + 2)
                if (kol<2) kol=2;
                kol += Math.floor(todayWorkMinutes/90)
               // console.log("1")
                //kol = Math.floor(interval / 90 + 2);
               // console.log(kol)
                if (kol >= 8 && checkState==true) {
                    console.log(kolForLastIcon)
                    if(kolForLastIcon > 11.3 && (getTime()/3600000) % 24 < 20 && (getTime()/3600000) % 24 > 10){
                        console.log(kolForLastIcon + "kol last icon")
                        getUserByLogin(gameUser.login).then((_user)=>{
                            editUserByLogin(gameUser.login, "stagethree", getTime(), false);
                        })
                    }else if(getTime()-gameUser.checkTime > 10800000 && (getTime()/3600000) % 24 < 20 && (getTime()/3600000) % 24 > 10){
                        getUserByLogin(gameUser.login).then((_user)=>{
                            editUserByLogin(gameUser.login, "stagethree", getTime(), false);
                        })
                    }
                    /*if (gameUser.checkTime < timeOfLastIcon){
                        if (getTime()-timeOfLastIcon> 5*60*60*1000 && (getTime()/360000) % 24 < 20 && (getTime()/360000) % 24 > 10){
                            getUserByLogin(gameUser.login).then((_user)=>{
                                editUserByLogin(gameUser.login, "stagethree", getTime(), false).then((__user)=>{
                                    SetGameUser(__user)
                                })
                            })
                        }
                    }else{
                        if( (getTime()/360000) % 24 < 20 && (getTime()/360000) % 24 > 10){
                            getUserByLogin(gameUser.login).then((_user)=>{
                                editUserByLogin(gameUser.login, "stagethree", getTime(), false).then((__user)=>{
                                    SetGameUser(__user)
                                })
                            })
                        }
                    //}
*/


                }else if(kol>=8) {kol = 8;} // перестановка на третью позицию.
                return {
                    stage: st,
                    stagefour: kol,
                    stagethree: 4,
                    stagetwo: 2,
                    stageone: 1
                }
            }
            else if(st === "stagethree"){
                let workMinutesPreviousDays = fullDaysGone*840; // 840 - количество рабочих часов в минутах
                let todayWorkMinutes = (interval % 1440) - 840; // 36.. то 10 часов в минутах
                if(todayWorkMinutes <0) {
                    if ((getTime()/1000/60%1440)/60 > 11){
                        todayWorkMinutes = interval;
                    }else{
                        todayWorkMinutes=0;}
                }
                else if((getTime()/1000/60%1440)/60 > 21) {
                    todayWorkMinutes = todayWorkMinutes - (getTime()/1000/60%1440- 21*60);
                    console.log(todayWorkMinutes)
                }
                let kolForLastIcon = workMinutesPreviousDays/90 + 1;
                if (kolForLastIcon<1) kolForLastIcon=1;
                kolForLastIcon += todayWorkMinutes/90;
                kolForLastIcon += (workMinutesPreviousDays / 90 - kolForLastIcon)<0? 0: (workMinutesPreviousDays / 90 - kolForLastIcon) + todayWorkMinutes / 90;
                let kol3 = Math.floor(workMinutesPreviousDays/90 + 1)
                if (kol3<0) kol3 = 1;
                kol3 +=  Math.floor(todayWorkMinutes / 90);
                if (kol3>4) kol3 =4;
                let kol4 = Math.floor(workMinutesPreviousDays / 90 - kol3);
                if(kol4 < 0) kol4 = 0;
                kol4 += Math.floor(todayWorkMinutes / 90);

                if(kol4 >=8 && kol3>=4){
                    if(kolForLastIcon > 15.3 && (getTime()/3600000) % 24 < 21 && (getTime()/3600000) % 24 >11){

                        getUserByLogin(gameUser.login).then((_user)=>{
                            editUserByLogin(gameUser.login, "stagetwo", getTime(), false);
                        })
                    }
                }
                return{
                    stage: st,
                    stagefour: kol4,
                    stagethree: kol3,
                    stagetwo: 2,
                    stageone: 1
                }
            }
            else if(st=="stagetwo" ){
                let workMinutesPreviousDays = fullDaysGone*840; // 840 - количество рабочих часов в минутах
                let todayWorkMinutes = (interval % 1440) - 840; // 36.. то 10 часов в минутах
                if(todayWorkMinutes <0) {
                    if ((getTime()/1000/60%1440)/60 > 11){
                        todayWorkMinutes = interval;
                    }else{
                        todayWorkMinutes=0;}
                }
                else if((getTime()/1000/60%1440)/60 > 21) {
                    todayWorkMinutes = todayWorkMinutes - (getTime()/1000/60%1440- 21*60);
                    console.log(todayWorkMinutes)
                }
                let kol2 = 2;
                let kol3 = Math.floor((interval) / 110 + 1);
                if (kol3>4) kol3 =4;

                let kol4 = Math.floor((interval) / 110-kol3);
                if (kol4 > 8) kol4 = 8;

                let kolForLastIcon = workMinutesPreviousDays/110;
                if (kolForLastIcon<0) kolForLastIcon=0;
                kolForLastIcon += todayWorkMinutes/110;
                kolForLastIcon += (workMinutesPreviousDays / 110 - kolForLastIcon)<0? 0: (workMinutesPreviousDays / 110 - kolForLastIcon) + todayWorkMinutes / 110;

                if(kol4 >=8 && kol3>=4){
                    if(kolForLastIcon > 15.3 && (getTime()/3600000) % 24 < 21 && (getTime()/3600000) % 24 >11){
                        getUserByLogin(gameUser.login).then((_user)=>{
                            editUserByLogin(gameUser.login, "stageone", getTime(), false);
                        })
                    }
                }
                return{
                    stage: st,
                    stagefour: kol4,
                    stagethree: kol3,
                    stagetwo: kol2,
                    stageone: 1
                };
            }
            else if (st=="stageone"){
                let workMinutesPreviousDays = fullDaysGone*840; // 840 - количество рабочих часов в минутах
                let todayWorkMinutes = (interval % 1440) - 840; // 36.. то 10 часов в минутах
                if(todayWorkMinutes <0) {
                    if ((getTime()/1000/60%1440)/60 > 11){
                        todayWorkMinutes = interval;
                    }else{
                        todayWorkMinutes=0;}
                }
                else if((getTime()/1000/60%1440)/60 > 21) {
                    todayWorkMinutes = todayWorkMinutes - (getTime()/1000/60%1440- 21*60);
                    console.log(todayWorkMinutes)
                }
                let kol2 = 2;
                let kol3 = Math.floor((interval) / 110 + 1);
                if (kol3>4) kol3 =4;

                let kol4 = Math.floor((interval) / 110-kol3);
                if (kol4 > 8) kol4 = 8;
                return {
                    stage: "stageone",
                    stagefour: kol4,
                    stagethree: kol3,
                    stagetwo: kol2,
                    stageone: 1
                };
            }
            return {
                stage: "stageone",
                stagefour: 0,
                stagethree: 0,
                stagetwo: 0,
                stageone: 1
            };
        }

    }

    function setStagePositionText(id){
        let stage;
        switch (id){
            case "stagefour": stage = 1; break;
            case "stagethree": stage = 2; break;
            case "stagetwo": stage = 3; break;
            case "stageone" : stage = 4; break;
        }
        setStage(stage);

    }

    //  const [data, setData] = useState();
    useEffect(()=>{
        if (user.lastUpdate != 1 ){
            document.querySelector(".gameWindow").classList.remove("gameBlur")
            document.querySelector(".gameStartCircle").classList.add("hidden")
            document.querySelector(".gameRightBlockBottom").addEventListener("click", getCheckCode)

        }

        const fetchData = async () => {
            const gameUser = await getUserByLogin(user.login);
            console.log(gameUser);
            setGameUser(gameUser);

            if (!gameUser.isAdmin){

                let jopa = Check(gameUser);
                console.log(jopa)
                setCirclesInfo(jopa)
                setStagePositionText(gameUser.stage)
                if (jopa.stage === "stagetwo" || jopa.stage === "stagethree"){
                    document.getElementById("checkbtnText").innerHTML = "just wait";
                }
                else if(jopa.stage === "stageone"){
                    document.getElementById("personal-code").innerHTML = " ";
                    document.getElementById("checkbtnText").innerHTML = "Requests";

                }else if(jopa.stage === "stagefour"){

                }
                document.getElementById("personal-code").innerHTML = gameUser.personalCode
                setTimeout(fetchData, 2000);
            }else{
                setAdmin(true);
                //document.getElementById("main-div").innerHTML = <Admin />;
            }
        }
        fetchData();
    }, [])


// gameblur убрать document.queryselector().classlist.remove("gameblur")
    return <div>{!isAdmin ?<div className="window">

        <div className="gameWindow gameBlur">
            <p className="gameRadarTitle">RADAR</p>
            <div className="gameRadarW"><div className="radarImage" id="radarWindow"><Ellipse circlesInfo={circlesInfo}/></div></div>
            <p className="gameCodeBlockLabel">Code:</p>
            <div className="gameCodeBlock"><p>dnvn1g3g9mcsx1dv</p></div>
            <div className="gameLeftBlock">
                <div className="gameLeftBlockTop stage" ><p>STAGE {stage}</p></div>
                <div className="gameLeftBlockMiddle position"><p>POSITION 4</p></div>
                <div className="gameLeftBlockButton codeleft" onClick={test => {console.log("TEST")}}><p id="personal-code">MY CODE</p></div>
            </div>
            <div className="gameRightBlock">
                <div className="gameRightBlockTop" onClick={copyTheCode}><p>COPY THE CODE</p></div>
                <div className="gameRightBlockBottom" onClick={()=>{}}><p id="checkbtnText">CHECK</p></div>

            </div>
            <div className="StarsBlock">
                <div className="Star1 StarNotSelected"/>
                <div className="Star2 StarNotSelected"/>
                <div className="Star3 StarNotSelected"/>
                <div className="Star4 StarNotSelected"/>
                <div className="Star5 StarNotSelected"/>
            </div>
            <input className="rulesBtn" type="image" alt="Rules" src={RulesPng} />
        </div>

        <div className="gameStartCircle" onClick={startGame}>
            <p id="startTextbtn">START</p>
            <input className="gamePersonalCode" id="personalCodeStart" type="text" placeholder="Code"/>
        </div>


    </div> : <Admin />}</div>

    /*<div id="main-div" style={{"display": "flex"}}>
        {!isAdmin ?<div>
        <div className='leftbar'><p className="stage">stage 1</p><p className="position">position 4</p><p className="codeleft">code Lorem ipsum dolor, sit amet consectetur adipisicing elit. </p></div>
        <div className='game' id="gameWindow">
            <Ellipse stage={circlesInfo.stage} circlesInfo={circlesInfo}/>
        </div>
        <div className='rightbar'><p className="coderight">code Lorem ipsum dolor, sit amet consectetur adipisicing elit. </p>{!checkPressed && <button onClick={changeCheckState}>CHECK</button>}</div>
            </div>:
            <Admin /> }
        </div>*/
}

const Ellipse = (props) => {

    // console.log(props.stage)
    var classes = ["stagefour", "stagethree", "stagetwo", "stageone"];
    var ids = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eight"];
    var ellipses = [];
    for(var i = 0; i< classes.length;i++){
        for(var j = 0; j< ids.length; j++)
        {

            if (j >= props.circlesInfo.stagefour && i === 0) break;
            if (j >= props.circlesInfo.stagethree && i === 1) break;
            if (j >= props.circlesInfo.stagetwo && i == 2) break;
            if (j === 1 && i === 3) break;
            if (j === 2 && i === 2) break;
            if (j === 4 && i === 1) break;
            if(classes[i] === props.circlesInfo.stage && j === 0){
                ellipses.push(<div key={i+" "+j} className={"gameEllipse " + classes[i] + " myPos"} id={ids[j]}></div>);
                continue;
            }else{
                ellipses.push(<div key={i+" "+j} className={"gameEllipse " + classes[i]} id={ids[j]}></div>)}
        }
    }

    return ellipses;
}