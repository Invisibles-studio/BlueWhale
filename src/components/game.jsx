/* eslint-disable */
import leftBg from "./images/leftbg.svg"
import {getUserByLogin} from "./firebase/api.tsx";
import {useState} from "react";

export default function Game({isGameStart, login}){

    const [user, SetUser] = useState();
    const [circlesInfo, setCirclesInfo] = useState( {});


    function getJsonStart(){
        getUserByLogin(login).then((_user)=>{
            SetUser(_user);
            Check();
        });

        /*if (lastUpdate > "40 minut i vremya ne noch to") надо на фор переписать элипсы с каким то массивом мейби хз */

    }

    function Check(){

        if (user.lastUpdate !== 1){
            let date = user.lastUpdate;
            let st = "stagefour"//user.stage;
            let interval = (Date.now() - date)/1000;
            interval = Math.round(interval / 60 % 60);
            let kol= 0;
            if (st === "stagefour" && interval >= 90 ){
                kol = interval % 90 + 2;
                if (kol > 8) kol = 8;
                setCirclesInfo({
                    stage: "stageone",
                    stagefour: kol,
                    stagethree: 4,
                    stagetwo: 2,
                    stageone: 1
                });
            }else if(st === "stagethree" && interval >= 720){
                let kol3 = (interval - 720) % 90;

                if (kol3>4) kol =4;
                setCirclesInfo( {
                    stage: "stageone",
                    stagefour: 2,
                    stagethree: 4,
                    stagetwo: 2,
                    stageone: 1
                });
            }
        }else{
            //let date = Date.now();
            console.log("HI")
            setCirclesInfo( {
                stage: "stageone",
                stagefour: 2,
                stagethree: 4,
                stagetwo: 2,
                stageone: 1
            });
        }
        console.log("cicInfo " + circlesInfo.stage);


    }

    getJsonStart();
    if (circlesInfo.stage == undefined ){

        return <div style={{"display": "flex"}}>
            <div className='leftbar'><p className="stage">stage 1</p><p className="position">position 4</p><p className="codeleft">code Lorem ipsum dolor, sit amet consectetur adipisicing elit. </p></div>
            <div className='game'>
            </div>
            <div className='rightbar'><p className="coderight">code Lorem ipsum dolor, sit amet consectetur adipisicing elit. </p><button onClick={Check}>CHECK</button></div>
        </div>
    }
    return <div style={{"display": "flex"}}>
        <div className='leftbar'><p className="stage">stage 1</p><p className="position">position 4</p><p className="codeleft">code Lorem ipsum dolor, sit amet consectetur adipisicing elit. </p></div>
        <div className='game'>
            <Ellipse stage={circlesInfo.stage} circlesInfo={circlesInfo.circlesInfo}/>
        </div>
        <div className='rightbar'><p className="coderight">code Lorem ipsum dolor, sit amet consectetur adipisicing elit. </p><button onClick={Check}>CHECK</button></div>
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



