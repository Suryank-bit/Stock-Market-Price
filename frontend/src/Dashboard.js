import Chart from "./Component/Chart";
import Pinup from "./Component/Pinup";
import * as d3 from "d3";
// import Header from "./Component/Header";
import TickerScroll from "./Component/TickerScroll";
// import Profile from "./Component/Profile";
import WatchList from "./Component/WatchList";
import {useState} from 'react'

function Dashbord() {
    const [data, setData] = useState(() => d3.ticks(-2, 2, 200).map(Math.sin));
    function onMouseMove(event) {
        const [x, y] = d3.pointer(event);
        setData(data.slice(-200).concat(Math.atan2(x, y)));
      }
    
    return(
        <div onMouseMove={onMouseMove} style={{display:"flex", flexDirection:"column", padding:"30px"}}>
        <header>
            <TickerScroll/>
        </header>
            <Pinup />
            {/* <div style={{display:"flex", flexDirection:"column", paddingRight:"30px"}}> */}
                <Chart  data={data}/>
                <WatchList />
            {/* </div> */}
        </div>
    )
}

export default Dashbord;