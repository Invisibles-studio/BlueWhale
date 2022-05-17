/* eslint-disable */
import leftBg from "./images/leftbg.svg"
import {editUserByLogin, getUserByLogin} from "./firebase/api.tsx";
import {useEffect, useState} from "react";

export default function Game({ user}){

    const [gameUser, setGameUser] = useState(null);
    const [circlesInfo, setCirclesInfo] = useState( {});
    const [checkPressed, SetCheckPressed] = useState(false)


    function changeCheckState(){
       // console.log(user)
        if(gameUser.checkState == true) {SetCheckPressed(true);return;}
        editUserByLogin(gameUser.login, gameUser.stage, gameUser.lastUpdate, true).then(userr=>{
             //SetUser(userrr)
            SetCheckPressed(true)
             SetGameUser(userr)
         });

    }

    function Check(gameUser){
        console.log(gameUser)
        if(gameUser == undefined) return;

        if (gameUser.lastUpdate !== 1){
            let date = gameUser.lastUpdate;
            let st = gameUser.stage;
            let interval = (Date.now() - date)/1000;
           // console.log(circlesInfo)
            interval = Math.round(interval / 60 );
            let kol= 0;

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
               // console.log("1")
                kol = Math.floor(interval / 90 + 2);
                console.log(kol)
                if (kol >= 8 && checkState==true) {
                    getUserByLogin(gameUser.login).then((_user)=>{
                        editUserByLogin(gameUser.login, "stagethree", Date.now(), false).then((__user)=>{
                            SetGameUser(__user)
                        })
                    })


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
                let kol3 =  Math.floor((interval) / 90 + 1);
                if (kol3>4) kol3 =4;
                let kol4 = Math.floor((interval) / 90-kol3);
                if (kol4 > 8) kol4 = 8;
                //console.log(kol3)
                //console.log("HI")
                if(kol4 >=8 && kol3>=4){
                    getUserByLogin(gameUser.login).then((_user)=>{
                        editUserByLogin(gameUser.login, "stagetwo", Date.now(), false).then((__user)=>{
                            SetGameUser(__user)
                        })
                    })
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
            }else if(st=="stagetwo"  ){
                let kol2 = 2;
                let kol3 = Math.floor((interval) / 110 + 1);
                if (kol3>4) kol3 =4;

                let kol4 = Math.floor((interval) / 110-kol3);
                if (kol4 > 8) kol4 = 8;
                //console.log(kol3)
                //console.log("HI")
                if(kol4 >=8 && kol3>=4){
                    getUserByLogin(gameUser.login).then((_user)=>{
                        editUserByLogin(gameUser.login, "stageone", Date.now(), false).then((__user)=>{
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
            }else if (st=="stageone"){
                setCirclesInfo( {
                    stage: "stageone",
                    stagefour: 8,
                    stagethree: 4,
                    stagetwo: 2,
                    stageone: 1
                });
            }

        }else{
            let date = Date.now();
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
            let jopa = Check(gameUser);
            console.log(jopa)
            document.getElementById("gameWindow").value = <Ellipse stage={jopa.stage} circlesInfo={jopa}/>
            //console.log(circlesInfo)
            setTimeout(fetchData, 2000);
        }
        fetchData();
    }, [])



    return <div style={{"display": "flex"}}>
        <div className='leftbar'><p className="stage">stage 1</p><p className="position">position 4</p><p className="codeleft">code Lorem ipsum dolor, sit amet consectetur adipisicing elit. </p></div>
        <div className='game' id="gameWindow">
            <Ellipse stage={circlesInfo.stage} circlesInfo={circlesInfo}/>
        </div>
        <div className='rightbar'><p className="coderight">code Lorem ipsum dolor, sit amet consectetur adipisicing elit. </p>{!checkPressed && <button onClick={changeCheckState}>CHECK</button>}</div>
    </div>
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



