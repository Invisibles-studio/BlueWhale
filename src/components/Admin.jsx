import React, { useState } from 'react';
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

    const [textId, setTextId] = useState()
    const [textValue, setTextValue] = useState()


    const changeText = async e => {
        e.preventDefault()
        document.getElementById(textId).text = textValue;
    }
    function enableCircle(name){
        document.querySelector(name).classList.remove("hidden")
    }
    function disableCircle(name){
        document.querySelector(name).classList.add("hidden")
    }
    function SelectCircle(name){
        let ellipses = document.getElementsByClassName("gameEllipse");
        for (let i in ellipses){
            if(ellipses.classList.contains("name")){
                ellipses.classList.add("myPos")
            }else if(ellipses.classList.contains("myPos")){
                ellipses.classList.remove("myPos")
            }
        }
    }



    return <div id="mainDiv" style={{"display": "flex"}}>
        <div className='leftbar' ><p id="stage">stage 1</p><p className="position" id="position">position 4</p><p id="codeleft">code Lorem ipsum dolor, sit amet consectetur adipisicing elit. </p></div>
        <div className='game' id="gameWindow">
            <EllipseAdmin />
        </div>
        <div className='rightbar' ><p id="coderight">code pisicing elit. </p><button >CHECK</button></div>
        <div><button >ADMIN PANEL</button></div>
        <div className="admin-panel">
            <div id="text-changer">
                <p>Change text</p>
                <form onSubmit={changeText}>
                    <label>
                        <p>Choose Text</p>
                        <select name="textId" onChange={e => setTextId(e.target.value)}>
                            <option value="stage">Stage text</option>
                            <option value="position">Position text</option>
                            <option value="codeleft">Code left</option>
                            <option value="coderight">Code right</option>
                        </select>
                    </label>
                    <label>
                        <p>type text here</p>
                        <textarea onChange={e => setTextValue(e.target.value)}></textarea>
                    </label>
                    <div>
                        <button type="submit">Change</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
}
