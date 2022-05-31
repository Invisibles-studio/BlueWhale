/* eslint-disable */
import {editUserByLogin, getUserByLogin} from "./firebase/api.tsx";
import {useEffect, useState} from "react";
import "./NewDesign/game.css"
import "./NewDesign/gameMaxHeight450.css"
import "./NewDesign/gameMaxHeight970.css"
import RulesPng from "./images/rules.png"
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import {renderToString} from "react-dom/server";
import {useNavigate} from "react-router-dom";

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
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const timeForStageFourAndThree = 0.1;//90;
    const timeForStageTwoAndOne = 0.1;//110
    const navigate = useNavigate()

    function copyTheCode(){
        navigator.clipboard.writeText(document.getElementById("personal-code").textContent)
    }

    function getTime(){
        //return Date.now()+10800000;
        return Date.now()
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
        getUserByLogin(localStorage.userLogin).then((usr)=>{
        if (usr.checkState === true){ return;}
        document.querySelector(".gameWindow").classList.add("gameBlur")
        document.querySelector(".gameStartCircle").classList.remove("hidden")
        document.querySelector(".gameStartCircle").addEventListener("click", changeCheckState)
        document.getElementById("startTextbtn").innerHTML = "Code";
        });

    }

    function changeCheckState(){
        let code = document.getElementById("personalCodeStart").value
        if (code === "") return;
        editUserByLogin(localStorage.userLogin, "", 1, true, getTime(), code)
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
                let kolForLastIcon = workMinutesPreviousDays/timeForStageFourAndThree + 2;
                if (kolForLastIcon<2) kolForLastIcon=2;
                kolForLastIcon += todayWorkMinutes/timeForStageFourAndThree;
                kol = Math.floor(workMinutesPreviousDays/timeForStageFourAndThree + 2)
                if (kol<2) kol=2;
                kol += Math.floor(todayWorkMinutes/timeForStageFourAndThree)
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
                let kolForLastIcon = workMinutesPreviousDays/timeForStageFourAndThree + 1;
                if (kolForLastIcon<1) kolForLastIcon=1;
                kolForLastIcon += todayWorkMinutes/timeForStageFourAndThree;
                kolForLastIcon += (workMinutesPreviousDays / timeForStageFourAndThree - kolForLastIcon)<0? 0: (workMinutesPreviousDays / timeForStageFourAndThree - kolForLastIcon) + todayWorkMinutes / timeForStageFourAndThree;
                let kol3 = Math.floor(workMinutesPreviousDays/timeForStageFourAndThree + 1)
                if (kol3<0) kol3 = 1;
                kol3 +=  Math.floor(todayWorkMinutes / timeForStageFourAndThree);
                if (kol3>4) kol3 =4;
                let kol4 = Math.floor(workMinutesPreviousDays / timeForStageFourAndThree - kol3);
                if(kol4 < 0) kol4 = 0;
                kol4 += Math.floor(todayWorkMinutes / timeForStageFourAndThree);

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
                let kol3 = Math.floor((interval) / timeForStageTwoAndOne + 1);
                if (kol3>4) kol3 =4;

                let kol4 = Math.floor((interval) / timeForStageTwoAndOne-kol3);
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
                let kol3 = Math.floor((interval) / timeForStageTwoAndOne + 1);
                if (kol3>4) kol3 =4;

                let kol4 = Math.floor((interval) / timeForStageTwoAndOne-kol3);
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
        getUserByLogin(localStorage.userLogin).then((usr)=>{
            if (usr.lastUpdate != 1 ){
                document.querySelector(".gameWindow").classList.remove("gameBlur")
                document.querySelector(".gameStartCircle").classList.add("hidden")
                document.querySelector(".gameRightBlockBottom").addEventListener("click", getCheckCode)

            }
        });


        const fetchData = async () => {
            const gameUser = await getUserByLogin(localStorage.userLogin);
            console.log(gameUser);
            setGameUser(gameUser);

            if (!gameUser.isAdmin){

                let jopa = Check(gameUser);

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


    function SelectCircle(){
        let pos = document.querySelector("#position-id").value;
        let circle = document.querySelector("#circle-id").value;

        console.log(pos+" "+circle)
        let classes
        let ellipseStage
        let ellipsePosition
        if (document.querySelector(".SelectedEllipse") === null){
            classes = document.querySelector(".stageoneSelected").classList.value.split(" ")
            ellipsePosition = document.querySelector(".stageoneSelected").id
            ellipseStage = classes[2]
            document.querySelector(".stageoneSelected").outerHTML = renderToString(<EllipseDesign id={ellipsePosition} class={ellipseStage}/>)
        }else{
            classes = document.querySelector(".SelectedEllipse").classList.value.split(" ")
            ellipseStage = classes[1]
            ellipsePosition = document.querySelector(".SelectedEllipse").id
            document.querySelector(".SelectedEllipse").outerHTML = renderToString(<EllipseDesign id={ellipsePosition} class={ellipseStage}/>)
        }

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
        const starsCount = 5;

        for(let i = 1; i<= starsCount; i++){

            let star = document.querySelector(".Star"+i);
            console.log(star);
            if(!star.classList.contains("StarSelected")) {
                star.classList.add("StarSelected")
                return;
            }
        }
    }

    function RemoveStar(){
        const starsCount = 5;

        for(let i = starsCount; i>=1; i--){

            let star = document.querySelector(".Star"+i);
            console.log(star);
            if(star.classList.contains("StarSelected")) {
                star.classList.remove("StarSelected")
                return;
            }
        }
    }

    function ChangeText(){
        let textId = document.querySelector("#textId").value;
        let textnameId = "";
        if (textId == 2) textnameId = "position";
        else if (textId == 1) textnameId = "stage";
        else if (textId == 3) textnameId = "personal-code";
        else if(textId == 4) textnameId = "upper-code";
        let text = document.querySelector("#txtarea").value;
        document.getElementById(textnameId).innerHTML = text;
    }

    function LogOut(){
        return navigate("/signout")
    }

// gameblur убрать document.queryselector().classlist.remove("gameblur")
    return <div>
        <div className="window">

        <div className="gameWindow gameBlur">
            <p className="gameRadarTitle" onClick={openModal}>RADAR</p>
            <div className="gameRadarW"><div className="radarImage" id="radarWindow"><Ellipse circlesInfo={circlesInfo}/></div></div>
            <p className="gameCodeBlockLabel">Code:</p>
            <div className="gameCodeBlock"><p id="upper-code">dnvn1g3g9mcsx1dv</p></div>
            <div className="gameLeftBlock">
                <div className="gameLeftBlockTop stage" ><p id="stage">STAGE {stage}</p></div>
                <div className="gameLeftBlockMiddle position"><p id="position">POSITION 4</p></div>
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
            <div className="gameSignOutButtonOnMain" onClick={LogOut}>
                <div className="gameSignOutButtonOnMainArrow"/>
            </div>
            <p className="gameSignOutButtonOnMainText">Log out</p>
        </div>

        <Modal
            open={modalIsOpen}
            onClose={closeModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className="AdminAccountModal">
                <p className="AdminAccountModalTitle">ADMIN ACCOUNT</p>
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
                        <button type="submit" onClick={SelectCircle}>Select</button>
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
                        <button type="submit" onClick={DisableCircle}>Disable</button>
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
                        <button type="submit" onClick={EnableCircle}>Enable</button>
                    </div>
                </div>
                <div id="stars">
                    <p>Stars</p>
                    <div>
                        <button id="addStar" type="submit" onClick={AddStar}>Add Star</button>
                    </div>

                    <div>
                        <button id="removeStar" type="submit" onClick={RemoveStar}>Remove Star</button>
                    </div>
                </div>
                <div id="text-changer">
                    <p className="AdminAccountModalChangeTextTitle">Change text</p>
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
                        <button type="submit" onClick={ChangeText}>Change</button>
                    </div>
                </div >
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
    if (props.class === "stageone" && props.isSelected){
        return <div key={props.key} className={"gameEllipseCenter stageoneSelected "+props.class} id={props.id}>
            <div className={"GameEllipseColoredCircle GameEllipseColoredCircleCenter "+props.class+"Radius"}/>
        </div>
    }else if (props.class === "stageone"){
        return <div key={props.key} className={"gameEllipseCenter stageoneColor "+props.class} id={props.id}>
        </div>
    } else if (props.isSelected){
        return <div key={props.key} className={"gameEllipse "+props.class+" SelectedEllipse"} id={props.id}>
            <div className={"GameEllipseColoredCircle "+props.class+"SelectedRadius"}/>
            <div className={"GameEllipseColoredSmallCircle "+props.class+"Color"} />
            <div className={"GameEllipseColoredSelectedCircle "+props.class+"SelectedCircle"} />
        </div>
    }else{
        return <div key={props.key} className={"gameEllipse "+props.class} id={props.id}>
            <div className={"GameEllipseColoredCircle "+props.class+"Radius"}/>
            <div className={"GameEllipseColoredSmallCircle "+props.class+"Color"} />
        </div>
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