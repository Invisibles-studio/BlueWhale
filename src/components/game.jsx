/* eslint-disable */
import {editUserByLogin, editUserByLoginNew, getUserByLogin, getRequestCode, editRequestCode} from "./firebase/api.tsx";
import {useEffect, useState} from "react";
import "./NewDesign/GameScreen.css"
/*import "./NewDesign/game.css"
import "./NewDesign/gameMaxHeight450.css"
import "./NewDesign/gameMaxHeight970.css"*/
import RulesPng from "./images/rules.png"
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import {renderToString} from "react-dom/server";
import {useNavigate} from "react-router-dom";

let circlesInfo = {
    stage: "stagefour",
    stagefour: 8,
    stagethree: 4,
    stagetwo: 2,
    stageone: 1
};
export default function Game({ user}){

    const [gameUser, setGameUser] = useState(null);
    /*let [circlesInfo, setCirclesInfo] = useState( {
        stage: "stagefour",
        stagefour: 8,
        stagethree: 4,
        stagetwo: 2,
        stageone: 1
    });*/

    const [checkPressed, SetCheckPressed] = useState(false)
    const [isAdmin, setAdmin] = useState(false);
    const [stage, setStage] = useState(4);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [gameFinishIsOpen, setGameFinishIsOpen] = useState(false);
    let timeForStageFourAndThree = 90;
    let timeForStageTwoAndOne = 110
    const navigate = useNavigate()
    let test = false
    let isEndGame = false
    let isShowCodeGame = false
    let isShowRequestBlock = false
    let timeToTestTotwopm = ((Date.now()+10800000)/1000/60/60%24-14)*3600000;

    function copyTheCode(){
        navigator.clipboard.writeText(document.getElementById("upper-code").textContent)
    }

    function getTime(){
        if (test){
           console.log((Date.now()+10800000) - timeToTestTotwopm)
            return (Date.now()+10800000) - timeToTestTotwopm
        } else{
            return Date.now()+10800000
        }
    }

    function startGame(){
        let code = document.getElementById("personalCodeStart").value
        if (code === "") return;
        getUserByLogin(localStorage.userLogin).then((_user)=>{
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
        getUserByLogin(localStorage.userLogin).then((usr)=>{
        if (usr.checkState === true){ return;}
        document.querySelector(".gameWindow").classList.add("gameBlur")
        document.querySelector(".gameStartCircle").classList.remove("hidden");
        document.querySelector(".gameStartCircle").removeEventListener("click", startGame)
        document.querySelector(".gameStartCircle").addEventListener("click", changeCheckState)
        document.getElementById("startTextbtn").innerHTML = "Code";
        });

    }

    function changeCheckState(){
        let code = document.getElementById("personalCodeStart").value
        if (code === "") return;
        //editUserByLogin(localStorage.userLogin, "", 1, true, getTime(), code)
        editUserByLoginNew(localStorage.userLogin, {"checkState" : true, "checkCode" : code})
        SetCheckPressed(true);
        document.querySelector(".gameRightBlockBottom").removeEventListener("click", getCheckCode, false)
        document.querySelector("#checkbtnText").innerHTML = "CHECKED"
    }

    function gameFinished() {
        setGameFinishIsOpen(true)
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
            interval = interval / 60 ;
            let kol= 0;
            let fullDaysGone = Math.floor(interval  /1440);
            let checkState = gameUser.checkState
            //console.log(interval)
            if(st =="stagefour" && interval < timeForStageFourAndThree){
                return {
                    stage: st,
                    stagefour: 2,
                    stagethree: 4,
                    stagetwo: 2,
                    stageone: 1
                }
            }
            else if (st === "stagefour"){
                let workMinutesPreviousDays = fullDaysGone*840; // 840 - ???????????????????? ?????????????? ?????????? ?? ??????????????
                //console.log(workMinutesPreviousDays /60 + "workHoursPrevious")
                let todayWorkMinutes = (interval % 1440) - 840; // 36.. ???? 10 ?????????? ?? ??????????????
                if(todayWorkMinutes <0) {
                    if ((getTime()/1000/60%1440)/60 > 10){
                        todayWorkMinutes = interval;
                    }else{
                    todayWorkMinutes=0;}
                }
                if((getTime()/1000/60%1440)/60 > 20) {

                    todayWorkMinutes = todayWorkMinutes - (getTime()/1000/60%1440- 20*60);
                    if (todayWorkMinutes <0 ) todayWorkMinutes = 0;
                    console.log(todayWorkMinutes)
                }
                let kolForLastIcon = workMinutesPreviousDays/timeForStageFourAndThree + 2;
                //console.log((getTime()/1000/60%1440)/60)
                if (kolForLastIcon<2) kolForLastIcon=2;
                kolForLastIcon += todayWorkMinutes/timeForStageFourAndThree;
                kol = Math.floor(workMinutesPreviousDays/timeForStageFourAndThree + 1)
                if (kol<2) kol=2;
                kol += Math.floor(todayWorkMinutes/timeForStageFourAndThree)
                //console.log(kol)
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



                }else if(kol>=8) {kol = 8;} // ???????????????????????? ???? ???????????? ??????????????.
                return {
                    stage: st,
                    stagefour: kol,
                    stagethree: 4,
                    stagetwo: 2,
                    stageone: 1
                }
            }
            else if(st === "stagethree"){
                let workMinutesPreviousDays = fullDaysGone*840; // 840 - ???????????????????? ?????????????? ?????????? ?? ??????????????
                let todayWorkMinutes = (interval % 1440) - 840; // 36.. ???? 10 ?????????? ?? ??????????????
                if(todayWorkMinutes <0) {
                    if ((getTime()/1000/60%1440)/60 > 11){
                        todayWorkMinutes = interval;
                    }else{
                        todayWorkMinutes=0;}
                }
                if((getTime()/1000/60%1440)/60 > 21) {
                    todayWorkMinutes = todayWorkMinutes - (getTime()/1000/60%1440- 21*60);
                    if (todayWorkMinutes <0 ) todayWorkMinutes = 0;
                    console.log(todayWorkMinutes)
                }
                let kolForLastIcon = workMinutesPreviousDays/timeForStageFourAndThree + 1;
                if (kolForLastIcon<1) kolForLastIcon=1;
                kolForLastIcon += todayWorkMinutes/timeForStageFourAndThree;
                kolForLastIcon += (workMinutesPreviousDays / timeForStageFourAndThree - kolForLastIcon)<0? 0: (workMinutesPreviousDays / timeForStageFourAndThree - kolForLastIcon) + todayWorkMinutes / timeForStageFourAndThree;
                let kol3 = Math.floor(workMinutesPreviousDays/timeForStageFourAndThree + 1)
                if (kol3<0) kol3 = 1;
                kol3 +=  Math.floor(todayWorkMinutes / timeForStageFourAndThree);
                if (kol3>4) kol3 =4;
                let kol4 = Math.floor(workMinutesPreviousDays / timeForStageFourAndThree);// - kol3);
                if(kol4 < 0) kol4 = 0;
                kol4 += Math.floor(todayWorkMinutes / timeForStageFourAndThree- kol3);//-4);
                if (kol3<4) kol4=0;
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
                let workMinutesPreviousDays = fullDaysGone*840; // 840 - ???????????????????? ?????????????? ?????????? ?? ??????????????
                let todayWorkMinutes = (interval % 1440) - 840; // 36.. ???? 10 ?????????? ?? ??????????????
                if(todayWorkMinutes <0) {
                    if ((getTime()/1000/60%1440)/60 > 11){
                        todayWorkMinutes = interval ;
                    }else{
                        todayWorkMinutes=0;}
                }
                 if((getTime()/1000/60%1440)/60 > 21) {
                    todayWorkMinutes = todayWorkMinutes - (getTime()/1000/60%1440- 21*60);
                     if (todayWorkMinutes <0 ) todayWorkMinutes = 0;
                    console.log(todayWorkMinutes)
                }
                let kol2 = 2;
                let kol3 = Math.floor(workMinutesPreviousDays/timeForStageTwoAndOne )
                if (kol3<0) kol3 = 1;
                kol3 +=  Math.floor(todayWorkMinutes / timeForStageTwoAndOne);
                if (kol3>4) kol3 =4;
                let kol4 = Math.floor(workMinutesPreviousDays / timeForStageTwoAndOne - kol3);
                if(kol4 < 0) kol4 = 0;
                kol4 += Math.floor(todayWorkMinutes / timeForStageTwoAndOne-4);
                if (kol3<4) kol4=0;
                if (kol4 > 8) kol4 = 8;

                let kolForLastIcon = workMinutesPreviousDays/timeForStageTwoAndOne;
                if (kolForLastIcon<0) kolForLastIcon=0;
                kolForLastIcon += todayWorkMinutes/timeForStageTwoAndOne;
                kolForLastIcon += (workMinutesPreviousDays / timeForStageTwoAndOne - kolForLastIcon)<0? 0: (workMinutesPreviousDays / timeForStageTwoAndOne - kolForLastIcon) + todayWorkMinutes / timeForStageTwoAndOne;

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
                let workMinutesPreviousDays = fullDaysGone*840; // 840 - ???????????????????? ?????????????? ?????????? ?? ??????????????
                let todayWorkMinutes = (interval % 1440) - 840; // 36.. ???? 10 ?????????? ?? ??????????????
                if(todayWorkMinutes <0) {
                    if ((getTime()/1000/60%1440)/60 > 11){
                        todayWorkMinutes = interval;
                    }else{
                        todayWorkMinutes=0;}
                }
                 if((getTime()/1000/60%1440)/60 > 21) {
                    todayWorkMinutes = todayWorkMinutes - (getTime()/1000/60%1440- 21*60);
                     if (todayWorkMinutes <0 ) todayWorkMinutes = 0;
                    console.log(todayWorkMinutes)
                }
                let kol2 = Math.floor((interval) / timeForStageTwoAndOne )
                if (kol2>2) kol2= 2;
                let kol3 = Math.floor((interval) / timeForStageTwoAndOne -kol2);
                if (kol2 < 2) kol3 = 0
                if (kol3>4) kol3 =4;

                let kol4 = Math.floor((interval) / timeForStageTwoAndOne-kol3 - 2);
                if (kol3<4) kol4=0
                if (kol4 >= 8) {
                    kol4 = 8;
                    if (!isEndGame){
                        isEndGame = true
                        gameFinished();
                    }
                }
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
            case "stagefour": stage = 4; break;
            case "stagethree": stage = 3; break;
            case "stagetwo": stage = 2; break;
            case "stageone" : stage = 1; break;
        }
        setStage(stage);

    }

    function openModal(){
        console.log(user.login)
        if (user.login === undefined){
            getUserByLogin(localStorage.userLogin).then((usr) =>{
                user = usr
                openModal()
            }
            )
        }
        if (user.isAdmin){
            setModalIsOpen(true)
        }
    }

    function closeModal(){
        setModalIsOpen(false)
    }

    //  const [data, setData] = useState();
    useEffect(()=>{
        for(let i = 1; i<9;i++){
            getRequestCode(i).then((code) =>{
                let d = "#r"+ i.toString()
                document.querySelector(d).querySelector(".requestTextAndButton").querySelector(".textRequest").innerHTML = code;
            })
        }
        getUserByLogin(localStorage.userLogin).then((usr)=>{
            if (usr.lastUpdate != 1 ){
                document.querySelector(".gameWindow").classList.remove("gameBlur")
                document.querySelector(".gameStartCircle").classList.add("hidden")
                document.querySelector(".gameRightBlockBottom").addEventListener("click", getCheckCode)

            }
        });

        const fetchData = async () => {
            const gameUser = await getUserByLogin(localStorage.userLogin);
           // console.log(gameUser);
            setGameUser(gameUser);

            if (!gameUser.isAdmin){
                let jopa = Check(gameUser);

                //setCirclesInfo(jopa)
                circlesInfo = jopa;
                //console.log(jopa)
                setStagePositionText(gameUser.stage)
                if (jopa.stage === "stagetwo" || jopa.stage === "stagethree"){
                    document.querySelector(".gameRightBlockTop").classList.add("hidden")
                    document.getElementById("checkbtnText").innerHTML = "just wait";
                }
                else if(jopa.stage === "stageone"){
                    document.querySelector(".gameRightBlockTop").classList.add("hidden")
                    document.querySelector(".requestText").classList.remove("hidden")
                    document.querySelector(".gameRightBlockBottom").classList.add("hidden")
                }else if(jopa.stage === "stagefour"){

                }
                setTimeout(fetchData, 2000);
            }else{
                setAdmin(true);
                //document.getElementById("main-div").innerHTML = <Admin />;
            }

            for (let i = 1; i < 3; i++){
                RemoveStar()
            }

            for (let i = 1; i <= gameUser.refUnicCount; ++i){
                AddStar()
            }

        }
        fetchData();
    }, [])

    async function StartGameAlgorithm(){
        const gameUser = await getUserByLogin(localStorage.userLogin);
        setGameUser(gameUser);
        let jopa = Check(gameUser);
        console.log(jopa)
        circlesInfo = jopa;
        setStagePositionText(gameUser.stage)
        if (jopa.stage === "stagetwo" || jopa.stage === "stagethree"){
            document.querySelector(".gameRightBlockTop").classList.add("hidden")
            document.getElementById("checkbtnText").innerHTML = "just wait";
        }
        else if(jopa.stage === "stageone"){
            document.querySelector(".gameRightBlockTop").classList.add("hidden")
            document.querySelector(".requestText").classList.remove("hidden")
            document.querySelector(".gameRightBlockBottom").classList.add("hidden")
            for (let i= 1; i<=jopa.stagefour; i++){
                let d = "#r" + i.toString();
                document.querySelector(d).classList.remove("hidden")
            }
        }else if(jopa.stage === "stagefour"){

        }
    }

    function SelectCircle(){
        let pos = document.querySelector("#position-id").value;
        let circle = document.querySelector("#circle-id").value;

        console.log(pos+" "+circle)
        let classes
        let ellipseStage
        let ellipsePosition
        if (pos === "stageone"){
            document.querySelector(".requestsBlock").classList.remove("hidden")
            document.querySelector(".gameRightBlockTop").classList.add("hidden")
            document.querySelector(".requestText").classList.remove("hidden")
            document.querySelector(".gameRightBlockBottom").classList.add("hidden")
            for (let i= 1; i<=circlesInfo.stagefour; i++){
                let d = "#r" + i.toString();
                document.querySelector(d).classList.remove("hidden")
            }
        }
        else if (pos === "stagetwo" || pos === "stagethree"){
            SetCheckPressed(true)
            document.querySelector(".requestText").classList.add("hidden")
            document.querySelector(".gameRightBlockBottom").classList.remove("hidden")
            for (let i= 1; i<=circlesInfo.stagefour; i++){
                let d = "#r" + i.toString();
                document.querySelector(d).classList.add("hidden")
            }
            document.querySelector(".gameRightBlockTop").classList.add("hidden")
            document.getElementById("checkbtnText").innerHTML = "just wait";
            document.querySelector(".requestsBlock").classList.add("hidden")
        }
        else if(pos==="stagefour"){
            SetCheckPressed(false)
            document.querySelector(".requestsBlock").classList.add("hidden")
            document.querySelector(".gameRightBlockTop").classList.remove("hidden")
            document.getElementById("checkbtnText").innerHTML = "CHECK";
        }
        classes = document.querySelector(".SelectedCircle").classList.value.split(" ")
        ellipseStage = classes[0]
        ellipsePosition = document.querySelector(".SelectedCircle").id
        document.querySelector(".SelectedCircle").outerHTML = renderToString(<EllipseDesign id={ellipsePosition} class={ellipseStage}/>)

        document.querySelector("."+pos+"#"+circle).outerHTML = renderToString(<EllipseDesign id={circle} class={pos} isSelected={true}/>)

    }

    function DisableCircle(){
        let pos = document.querySelector("#position-idD").value;
        let circle = document.querySelector("#circle-idD").value;

        document.querySelector("."+pos+"#"+circle).classList.add("hidden")
    }

    function EnableCircle(){
        let pos = document.querySelector("#position-idE").value;
        let circle = document.querySelector("#circle-idE").value;

        let classes = document.querySelector("."+pos+"#"+circle).classList
        if (classes.contains("hidden")){
            document.querySelector("."+pos+"#"+circle).classList.remove("hidden")
        }
    }

    function AddStar(){
        const starsCount = 3;
        for(let i = 1; i<= starsCount; i++){

            let star = document.querySelector(".Star"+i);
            if(!star.classList.contains("StarSelected")) {
                star.classList.add("StarSelected")
                return;
            }
        }
    }

    function RemoveStar(){
        const starsCount = 3;

        for(let i = starsCount; i>=1; i--){

            let star = document.querySelector(".Star"+i);
            console.log(star);
            if(star.classList.contains("StarSelected")) {
                star.classList.remove("StarSelected")
                return;
            }
        }
    }

    function AddRequest(){
        const reqCount = 8;
        for (let i = 1; i<=reqCount; i++){
            let d = "#r" + i.toString()
            let req = document.querySelector(d)
            if (req.classList.contains("hidden")){
                req.classList.remove("hidden")
                return;
            }
        }
    }

    function RemoveRequest(){
        const reqCount = 8;
        for (let i = reqCount; i>0; i--){
            let d = "#r" + i.toString()
            let req = document.querySelector(d)
            if (!req.classList.contains("hidden")){
                req.classList.add("hidden")
                return;
            }
        }
    }

    function ChangeRequest(){
        let textId = document.querySelector("#ReqId").value;
        let text = document.querySelector("#txtareaRequest").value;
        editRequestCode(textId, text)
        //editUserByLoginNew(localStorage.userLogin, {"personalCode": text})
        let textnameId = "#r" + textId.toString()
        document.querySelector(textnameId).querySelector(".requestTextAndButton").querySelector(".textRequest").innerHTML = text;
    }

    function ChangeText(){
        let textId = document.querySelector("#textId").value;
        let textnameId = "";
        let text = document.querySelector("#txtarea").value;
        if (textId == 2) textnameId = "position";
        else if (textId == 1) textnameId = "stage";
        else if (textId == 3) textnameId = "personal-code";
        else if(textId == 4) {
            textnameId = "upper-code";
            editUserByLoginNew(localStorage.userLogin, {"personalCode": text})
        }

        document.getElementById(textnameId).innerHTML = text;
    }

    function LogOut(){
        return navigate("/signout")
    }

    function StartAlgorithm(){
        let type = document.querySelector("#alg-speed").value;
        switch (type) {
            case "fast":
                timeForStageFourAndThree = 0.1
                timeForStageTwoAndOne = 0.1
                break
            case "normal":
                timeForStageFourAndThree = 90
                timeForStageTwoAndOne = 110
                break
        }
        test = true
        editUserByLoginNew(localStorage.userLogin, {"lastUpdate":getTime(), "stage":"stagefour", "checkState": false, "checkTime":0})
        gameUser.isAdmin = false
        console.log(getTime())
        setGameUser(gameUser)
        setInterval(StartGameAlgorithm, 2000)

    }

    async function ShowOrHideCodeGame(){
        if (isShowCodeGame){
            document.querySelector(".gameCodeBlock").classList.add("hidden")
            document.querySelector(".gameCodeBlockLabel").classList.add("hidden")
            isShowCodeGame = false
        }
        else{
            let userG = await getUserByLogin(localStorage.userLogin)
            document.querySelector(".gameCodeBlock").classList.remove("hidden")
            document.querySelector(".gameCodeBlockLabel").classList.remove("hidden")
            document.querySelector("#upper-code").innerHTML = userG.personalCode
            setTimeout(ShowOrHideCodeGame, 5000)
            isShowCodeGame = true
        }
    }

    function OpenRefBlock(id){
        getUserByLogin(localStorage.userLogin).then((user) => {
            document.querySelector(".refBlockLink").innerHTML = "https://invisibles-studio.github.io/BlueWhale"+"/?ref="+user.refCode[id] //document.location.toString().split("/game")[0]+"/?ref="+user.refCode[id]
            document.querySelector(".refBlock").classList.remove("hidden")
        })

    }

    function CloseRefBlock(){
        document.querySelector(".refBlock").classList.add("hidden")

    }

    function CopyRefLink(){
        navigator.clipboard.writeText(document.querySelector(".refBlockLink").innerHTML)
    }

    function CloseGameFinishModal(){
        setGameFinishIsOpen(false)
    }

    function ClickOnRequestsBlock(){
        if (isShowRequestBlock){
            document.querySelector(".requestsBlock").classList.add("hidden")
            isShowRequestBlock = false
        }
        else{
            document.querySelector(".requestsBlock").classList.remove("hidden")
            isShowRequestBlock = true
        }
    }

    return <div>
        <div className="window">

        <div className="gameWindow gameBlur">
            <p className="gameRadarTitle" onClick={openModal}>RADAR</p>
            <div className="gameRadarW"><div className="radarImage" id="radarWindow"><Ellipse circlesInfo={circlesInfo}/></div></div>
            <p className="gameCodeBlockLabel hidden">Code:</p>
            <div className="gameCodeBlock hidden"><p id="upper-code"></p></div>
            <div className="gameLeftBlock">
                <div className="gameLeftBlockTop stage" ><p id="stage">STAGE 1</p></div>
                <div className="gameLeftBlockMiddle position"><p id="position">POSITION {stage}</p></div>
                <div className="gameLeftBlockButton codeleft" onClick={ShowOrHideCodeGame}><p id="personal-code">MY CODE</p></div>
            </div>
            <div className="gameRightBlock">
                <div className="requestText hidden" onClick={ClickOnRequestsBlock}>
                    <p>REQUEST</p>
                </div>
                <div className="requestsBlock hidden">
                    <div id="r1" className="request hidden"><div className="requestTextAndButton"><p className="textRequest"></p><p className="buttonRequest">confirm</p></div></div>
                    <div id="r2" className="request hidden"><div className="requestTextAndButton"><p className="textRequest"></p><p className="buttonRequest">confirm</p></div></div>
                    <div id="r3" className="request hidden"><div className="requestTextAndButton"><p className="textRequest"></p><p className="buttonRequest">confirm</p></div></div>
                    <div id="r4" className="request hidden"><div className="requestTextAndButton"><p className="textRequest"></p><p className="buttonRequest">confirm</p></div></div>
                    <div id="r5" className="request hidden"><div className="requestTextAndButton"><p className="textRequest"></p><p className="buttonRequest">confirm</p></div></div>
                    <div id="r6" className="request hidden"><div className="requestTextAndButton"><p className="textRequest"></p><p className="buttonRequest">confirm</p></div></div>
                    <div id="r7" className="request hidden"><div className="requestTextAndButton"><p className="textRequest"></p><p className="buttonRequest">confirm</p></div></div>
                    <div id="r8" className="request hidden"><div className="requestTextAndButton"><p className="textRequest"></p><p className="buttonRequest">confirm</p></div></div>
                </div>
                <div className="gameRightBlockTop" onClick={copyTheCode}><p>COPY THE CODE</p></div>
                <div className="gameRightBlockBottom" onClick={()=>{}}><p id="checkbtnText">CHECK</p></div>
            </div>
            <div className="StarsBlock">
                <div className="Star1 StarNotSelected" onClick={() => OpenRefBlock(0)}/>
                <div className="Star2 StarNotSelected" onClick={() => OpenRefBlock(1)}/>
                <div className="Star3 StarNotSelected" onClick={() => OpenRefBlock(2)}/>
            </div>
            <div className="gameSignOutButtonOnMain" onClick={LogOut}>
                <div className="gameSignOutButtonOnMainArrow"/>
            </div>
            <p className="gameSignOutButtonOnMainText">Log out</p>
            <div className="refBlock hidden">
                <p className="refBlockLink">https://localhost:3000/?ref=12345</p>
                <input type="button" className="refBlockCrossButton" onClick={CloseRefBlock}/>
                <input type="button" className="refBlockCopyLink" onClick={CopyRefLink} value={"COPY"}/>
            </div>
        </div>

        <Modal
            open={modalIsOpen}
            onClose={closeModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className="AdminAccountModal">
                <p className="AdminAccountModalTitle" onClick={getTime}>ADMIN ACCOUNT</p>
                <div className="AdminAccountModalClose" onClick={closeModal}/>
                <div id="setPosition">
                    <p className="AdminAccountModalSelectStageTitle">Select stage</p>
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
                        <button type="submit" class="AdminBtn" onClick={SelectCircle}>Select</button>
                    </div>
                </div>
                <div id="disableCircle">
                    <p className="AdminAccountModalDisableCircleTitle">Disable circle</p>
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
                        <button type="submit" class="AdminBtn" onClick={DisableCircle}>Disable</button>
                    </div>
                </div>
                <div id="enableCircle">
                    <p className="AdminAccountModalEnableCircleTitle">Enable circle</p>
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
                        <button type="submit" class="AdminBtn" onClick={EnableCircle}>Enable</button>
                    </div>
                </div>
                <div id="stars">
                    <p>Stars</p>
                    <div>
                        <button id="addStar" class="AdminBtn" type="submit" onClick={AddStar}>Add Star</button>
                    </div>

                    <div>
                        <button id="removeStar" class="AdminBtn" type="submit" onClick={RemoveStar}>Remove Star</button>
                    </div>
                </div>
                <div id="text-changer">
                    <p className="AdminAccountModalChangeTextTitle">Change text</p>
                    <select id="textId" >
                        <option value="1">Stage text</option>
                        <option value="2">Position text</option>
                        {/*<option value="3">Code left</option>*/}
                        <option value="4">Upper code</option>
                    </select>
                    <div>
                        <textarea placeholder="type text here" id="txtarea"></textarea>
                    </div>
                    <div>
                        <button type="submit" class="AdminBtn" onClick={ChangeText}>Change</button>
                    </div>
                </div >
                <div id="AlgorithmSpeed">
                    <p className="AdminAccountModalAlgSpeedTitle">Algorithm speed</p>
                    <select id="alg-speed">
                        <option value="fast">Fast</option>
                        <option value="normal">Normal</option>
                    </select>
                    <button type="submit" className="AdminBtn" onClick={StartAlgorithm}>Start algorithm</button>
                </div>
                <div id="request-changer">
                    <p className="AdminAccountModalChangeRequestTitle">Request text</p>
                    <select id="ReqId" >
                        <option value="1">Request 1</option>
                        <option value="2">Request 2</option>
                        <option value="3">Request 3</option>
                        <option value="4">Request 4</option>
                        <option value="5">Request 5</option>
                        <option value="6">Request 6</option>
                        <option value="7">Request 7</option>
                        <option value="8">Request 8</option>
                    </select>
                    <div>
                        <textarea placeholder="type text here" id="txtareaRequest"></textarea>
                    </div>
                    <div>
                        <button type="submit" class="AdminBtn" onClick={ChangeRequest}>Change</button>
                    </div>
                </div >
                <div id="requestAddRemove">
                    <p>Requests count</p>
                    <div>
                        <button id="addReq" type="submit" class="AdminBtn" onClick={AddRequest}>Add Request</button>
                    </div>

                    <div>
                        <button id="removeReq" type="submit" class="AdminBtn" onClick={RemoveRequest}>Remove Request</button>
                    </div>
                </div>
            </Box>
        </Modal>

         <Modal
             open={gameFinishIsOpen}
             aria-labelledby="modal-modal-title"
             aria-describedby="modal-modal-description">
             <Box className="GameFinishModal">
                <p className="TitleGameFinish">Game Finish!</p>
                <p className="TextGameFinish">Game is over!</p>
             </Box>
         </Modal>

        <div className="gameStartCircle" onClick={startGame}>
            <p id="startTextbtn">START</p>
            <input className="gamePersonalCode" id="personalCodeStart" type="text" placeholder="Code"/>
        </div>


    </div>
    </div>

}

const EllipseDesign = (props) => {

    if (props.isSelected){
        return <div key={props.key} className={props.class+" "+props.class+"Selected"+" SelectedCircle"} id={props.id}/>
    }
    else {
        return <div key={props.key} className={props.class+" "+props.class+"NotSelected"} id={props.id}/>
    }
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
                //ellipses.push(<div key={i+" "+j} className={"gameEllipse " + classes[i] + " myPos"} id={ids[j]}></div>);
                ellipses.push(<EllipseDesign key={i+" "+j} isSelected={true} class={classes[i]} id={ids[j]}/>)
                continue;
            }else{
                ellipses.push(<EllipseDesign key={i+" "+j} class={classes[i]} id={ids[j]}/>)
                //ellipses.push(<div key={i+" "+j} className={"gameEllipse " + classes[i]} id={ids[j]}></div>)
                }
        }
    }

    return ellipses;
}