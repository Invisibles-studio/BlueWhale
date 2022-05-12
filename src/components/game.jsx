export default function Game({isGameStart}){

    function getJsonStart (){

        let user =  {
            login : "jopa",
            stage : "stageone",
            lastUpdate : "none",
            checkState : "false"
        }

        /*if (lastUpdate > "40 minut i vremya ne noch to") надо на фор переписать элипсы с каким то массивом мейби хз */
        return user
    }

    function Check(){
        let info = getJsonStart();
        let circlesInfo;
        if (info.lastUpdate !== "none"){
            let date = info.lastUpdate;
            let st = info.stage;

            let interval = (Date.now() - date)/1000;
            interval = Math.round(interval / 60 % 60);
            let kol= 0;
            if (st === "stagefour" && interval >= 90 ){
                kol = interval % 90 + 2;
                if (kol > 8) kol = 8;
                circlesInfo = {
                    stagefour: kol,
                    stagethree: 4,
                    stagetwo: 2,
                    stageone: 1
                }
            }else if(st === "stagethree" && interval >= 720){
                let kol3 = (interval - 720) % 90;

                if (kol3>4) kol =4;

            }
        }else{
            //let date = Date.now();
            circlesInfo = {
                stagefour: 2,
                stagethree: 4,
                stagetwo: 2,
                stageone: 1
            }
        }

        return circlesInfo
    }

    let dbData  = Check();

    return <div className='main'>
        <div className='leftbar'><p className="stage">stage 1</p><p className="position">position 4</p><p className="codeleft">code Lorem ipsum dolor, sit amet consectetur adipisicing elit. </p></div>
        <div className='game'>
            <Ellipse stage={dbData.stage} circlesInfo={dbData.circlesInfo}/>
        </div>
        <div className='rightbar'><p className="coderight">code Lorem ipsum dolor, sit amet consectetur adipisicing elit. </p><button onClick={Check}>CHECK</button></div>
    </div>
}

const Ellipse = (props) => {

    console.log(props.stage)
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



