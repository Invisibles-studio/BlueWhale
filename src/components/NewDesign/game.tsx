/* eslint-disable */
import "./game.css"

export default function Game(){


    return <div className="gameWindow">

        <p className="gameRadarTitle">RADAR</p>
        <div className="gameRadarW"><div/></div>
        <p className="gameCodeBlockLabel">Code:</p>
        <div className="gameCodeBlock"><p>dnvn1g3g9mcsx1dv</p></div>
        <div className="gameLeftBlock">
            <div className="gameLeftBlockTop"><p>STAGE 1</p></div>
            <div className="gameLeftBlockMiddle"><p>POSITION 4</p></div>
            <div className="gameLeftBlockButton" onClick={test => {console.log("TEST")}}><p>MY CODE</p></div>
        </div>

    </div>
}