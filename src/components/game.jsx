/* eslint-disable */
import leftBg from "./images/leftbg.svg"
import {editUserByLogin, getUserByLogin} from "./firebase/api.tsx";
import {useEffect, useState} from "react";
import Admin from "./Admin";
import "./NewDesign/game.css"

export default function Game({ user}){

    const [gameUser, setGameUser] = useState(null);
    const [circlesInfo, setCirclesInfo] = useState( {});
    const [checkPressed, SetCheckPressed] = useState(false)
    const [isAdmin, setAdmin] = useState(false);

    function getTime(){
        return Date.now()+10800000;
    }

    function changeCheckState(){
       // console.log(user)
        if(gameUser.checkState === true) {SetCheckPressed(true);return;}
        editUserByLogin(gameUser.login, gameUser.stage, gameUser.lastUpdate, true, getTime()).then(userr=>{
             //SetUser(userrr)
            SetCheckPressed(true)
             SetGameUser(userr)
         });

    }

    function timeOfLastIcon(){
        let lastUpdate;
        let temp
        // if lastupdate.hours < 10 {
        //      temp =10 chasov - lastupdate%1440;
        // }
        // else if(lastupdate.hours > 20){
        //      temp  = 10 часов следующего дня - lastupdate типа ночные часы считаем
        // }
        // let timeLastIcon = 840 + temp;
        // if timeLastIcon.hours > 20 or < 10 => добираем до следующего дняё

    }

    function Check(gameUser){
        console.log(gameUser)
        if(gameUser == undefined) return;

        if (gameUser.lastUpdate !== 1){
            let date = gameUser.lastUpdate;

            let st = gameUser.stage;
            let interval = (getTime() - date)/1000;
            console.log(interval + " interval")
            interval = Math.round(interval / 60 );
            let kol= 0;
            let fullDaysGone = Math.floor(interval  /1440);

            //console.log( interval)
           let checkState = gameUser.checkState // ______________________________________Переделывай
            if(st =="stagefour" && interval < 90){

                console.log('f')
                setCirclesInfo({
                    stage: st,
                    stagefour: 2,
                    stagethree: 4,
                    stagetwo: 2,
                    stageone: 1
                });
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
                console.log(workMinutesPreviousDays /60 + "workHoursPrevious")
                let todayWorkMinutes = (interval % 1440) - 36000000; // 36.. то 10 часов в секундах
                if(todayWorkMinutes <0) todayWorkMinutes=0;
                else if((getTime()%1440)/60 > 20) todayWorkMinutes = 36000000;
                console.log("today " + todayWorkMinutes); // будет работать только на следующий день после регистрации. // или нормально
                kol = Math.floor(workMinutesPreviousDays/90 + 2)
                if (kol<2) kol=2;
                kol += Math.floor(todayWorkMinutes/90)
               // console.log("1")
                //kol = Math.floor(interval / 90 + 2);
                console.log(kol)
                if (kol >= 8 && checkState==true) {
                    //if (5*fullDaysGone > 8)
                    let i = gameUser.lastUpdate + 5*f; // хуйня ебаная, смотри ком ниже.
                    //let timeOfLastIcon = 6 * 5400000 + gameUser.lastUpdate; //надо учитывать что они в разные дни создаются
                    if (gameUser.checkTime < timeOfLastIcon){
                        if (getTime()-timeOfLastIcon> 5*60*60*1000 && (getTime()/360000) % 24 < 20 && (getTime()/360000) % 24 > 10){
                            getUserByLogin(gameUser.login).then((_user)=>{
                                editUserByLogin(gameUser.login, "stagethree", getTime(), false).then((__user)=>{
                                    SetGameUser(__user)
                                })
                            })
                        }
                    }else{
                        if(getTime()-gameUser.checkTime > 10800000 && (getTime()/360000) % 24 < 20 && (getTime()/360000) % 24 > 10){
                            getUserByLogin(gameUser.login).then((_user)=>{
                                editUserByLogin(gameUser.login, "stagethree", getTime(), false).then((__user)=>{
                                    SetGameUser(__user)
                                })
                            })
                        }
                    }



                }else if(kol>=8) {kol = 8;} // перестановка на третью позицию.
                setCirclesInfo({
                    stage: st,
                    stagefour: kol,
                    stagethree: 4,
                    stagetwo: 2,
                    stageone: 1
                });
                return {
                    stage: st,
                    stagefour: kol,
                    stagethree: 4,
                    stagetwo: 2,
                    stageone: 1
                }
            }
            else if(st === "stagethree"){
                let workMinutesPreviousDays = fullDaysGone*840;

                let todayWorkMinutes = (interval % 1440) - 39600000;
                if(todayWorkMinutes <0) todayWorkMinutes=0;
                else if((getTime()%1440)/60 > 20) todayWorkMinutes = 39600000;
                let kol3 = Math.floor(workMinutesPreviousDays/90 + 1)

                kol3 +=  Math.floor(todayWorkMinutes / 90);
                if (kol3>4) kol3 =4;
                let kol4 = Math.floor(workMinutesPreviousDays / 90 - kol3);
                kol4 += Math.floor(todayWorkMinutes / 90);
                if (kol4 > 8) kol4 = 8;
                //console.log(kol3)
                //console.log("HI")
                if(kol4 >=8 && kol3>=4){
                    let timeOfLastIcon = 8 * 5400000 + 3* + gameUser.lastUpdate; // хуйня ебаная
                    if (gameUser.checkTime < timeOfLastIcon){
                        if (getTime()-timeOfLastIcon> 5*60*60*1000 && (getTime()/360000) % 24 < 20 && (getTime()/360000) % 24 > 10){
                            getUserByLogin(gameUser.login).then((_user)=>{
                                editUserByLogin(gameUser.login, "stagetwo", getTime(), false).then((__user)=>{
                                    SetGameUser(__user)
                                })
                            })
                        }
                    }else{
                        if(getTime()-gameUser.checkTime > 10800000 && (getTime()/360000) % 24 < 20 && (getTime()/360000) % 24 > 10){
                            getUserByLogin(gameUser.login).then((_user)=>{
                                editUserByLogin(gameUser.login, "stagetwo", getTime(), false).then((__user)=>{
                                    SetGameUser(__user)
                                })
                            })
                        }
                    }
                }else{
                setCirclesInfo( {
                    stage: st,
                    stagefour: kol4,
                    stagethree: kol3,
                    stagetwo: 2,
                    stageone: 1
                });
                return{
                    stage: st,
                    stagefour: kol4,
                    stagethree: kol3,
                    stagetwo: 2,
                    stageone: 1
                }
                }
            }
            else if(st=="stagetwo"  ){
                let kol2 = 2;
                let kol3 = Math.floor((interval) / 110 + 1);
                if (kol3>4) kol3 =4;

                let kol4 = Math.floor((interval) / 110-kol3);
                if (kol4 > 8) kol4 = 8;
                //console.log(kol3)
                //console.log("HI")
                if(kol4 >=8 && kol3>=4){

                    getUserByLogin(gameUser.login).then((_user)=>{
                        editUserByLogin(gameUser.login, "stageone", getTime(), false, 0).then((__user)=>{
                            SetGameUser(__user)
                        })

                    })
                }else{

                setCirclesInfo( {
                    stage: st,
                    stagefour: kol4,
                    stagethree: kol3,
                    stagetwo: kol2,
                    stageone: 1
                });}
            }
            else if (st=="stageone"){
                setCirclesInfo( {
                    stage: "stageone",
                    stagefour: 8,
                    stagethree: 4,
                    stagetwo: 2,
                    stageone: 1
                });
            }

        }
        else{

            //console.log("HI")
            setCirclesInfo( {
                stage: "stageone",
                stagefour: 0,
                stagethree: 0,
                stagetwo: 0,
                stageone: 0
            });
        }
       // console.log("cicInfo " + circlesInfo.stage);


    }


    //  const [data, setData] = useState();
    useEffect(()=>{
        const fetchData = async () => {
            const gameUser = await getUserByLogin(user.login);
           // console.log(gameUser);
            setGameUser(gameUser);
            if (!gameUser.isAdmin){
                let jopa = Check(gameUser);
                console.log(jopa)
                document.getElementById("gameWindow").value = <Ellipse stage={jopa.stage} circlesInfo={jopa}/>
                //возможно нужно innerHTML
                setTimeout(fetchData, 2000);
            }else{
                setAdmin(true);
                //document.getElementById("main-div").innerHTML = <Admin />;
            }
        }
        fetchData();
    }, [])



    return <div className="gameWindow">

        <p className="gameRadarTitle">RADAR</p>
        <div className="gameRadarW"><div className="radarImage"><Ellipse stage={circlesInfo.stage} circlesInfo={circlesInfo}/></div></div>
        <p className="gameCodeBlockLabel">Code:</p>
        <div className="gameCodeBlock"><p>dnvn1g3g9mcsx1dv</p></div>
        <div className="gameLeftBlock">
            <div className="gameLeftBlockTop stage"><p>STAGE 1</p></div>
            <div className="gameLeftBlockMiddle position"><p>POSITION 4</p></div>
            <div className="gameLeftBlockButton codeleft" onClick={test => {console.log("TEST")}}><p>MY CODE</p></div>
        </div>
        <div className="gameRightBlock">
            <div className="gameRightBlockTop" onClick={test => {console.log("TEST")}}><p>COPY THE CODE</p></div>
            <div className="gameRightBlockBottom" onClick={test => {console.log("TEST")}}><p>CHECK</p></div>

        </div>

    </div>

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
            if(classes[i] === props.stage && j === 0){
                ellipses.push(<div key={i+" "+j} className={"gameEllipse " + classes[i] + " myPos"} id={ids[j]}></div>);
                continue;
            }else{
                ellipses.push(<div key={i+" "+j} className={"gameEllipse " + classes[i]} id={ids[j]}></div>)}
        }
    }

    return ellipses;
}