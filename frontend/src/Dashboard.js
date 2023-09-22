import Chart from "./Component/Chart";
import Pinup from "./Component/Pinup";
// import * as d3 from "d3";
import TickerScroll from "./Component/TickerScroll";
// import Profile from "./Component/Profile";
import WatchList from "./Component/WatchList";
import {useEffect, useState} from 'react'
import "./Dashboard.css"


const logout = () => {
    localStorage.removeItem('accessToken');
};


const DropdownMenu = () => {
    return (
        <div className="dropdown-menu">
            <ul>
                <li style={{color:'white', margin:0}}><a onClick={logout}>LOG OUT</a></li>
            </ul>
        </div>
    )
}


function Dashbord() {
    
    const [isDropdownVisible, setDropdownVisible] = useState(false);

    const handleMouseEnter = () => {
        setDropdownVisible(true);
    }
    const handleMouseLeave = () => {
        setDropdownVisible(false);
    }

    const com = ["SBIN", "ADANIENT", "TSLA", "AMZN"]


    return(
        <div style={{display:"flex", flexDirection:"column", padding:"30px"}}>
        <header style={{display:"flex", justifyContent:"space-between"}}>
            {com.map((e) => {
                return (
                    <TickerScroll key={e} props={e}/>
                )
            })}
            <div style={{display:"flex", gap:"15px", zIndex: 1, backgroundColor:"black", alignItems:"center", marginRight:"30px"}} onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}>
                <div style={{backgroundColor:"white", width:"50px", height:"50px", borderRadius:"50%"}}></div>
                <h2 style={{color:"white", margin:"0"}}>Suryank</h2>
                {/* <DropdownMenu /> */}
                {isDropdownVisible && <DropdownMenu />}
            </div>
        </header>
        <span style={{display:'flex', flexDirection:'row', gap:'30px', marginRight:'20px'}}>
            <Pinup ticker='AAPL'/>
            <Pinup ticker='MSFT'/>
            <Pinup ticker='RELIANCE'/>
            <Pinup ticker='ITC'/>
            <Pinup ticker='GOOGL'/>
            <Pinup ticker='LNT'/>
        </span>
                <Chart/>
                <WatchList id ={1} />
        </div>
    )
}

export default Dashbord;