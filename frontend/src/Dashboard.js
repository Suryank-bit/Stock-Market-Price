import Chart from "./Component/Chart";
import Pinup from "./Component/Pinup";
// import Header from "./Component/Header";
import TickerScroll from "./Component/TickerScroll";
// import Profile from "./Component/Profile";
import WatchList from "./Component/WatchList";

function Dashbord() {
    return(
        <div style={{display:"flex", flexDirection:"column", padding:"30px"}}>
        <header>
            <TickerScroll/>
        </header>
            <Pinup />
            <Chart />
            <WatchList />
        </div>
    )
}

export default Dashbord;