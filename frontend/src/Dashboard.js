import Chart from "./Component/Chart";
import Pinup from "./Component/Pinup";
import * as d3 from "d3";
import TickerScroll from "./Component/TickerScroll";
// import Profile from "./Component/Profile";
import WatchList from "./Component/WatchList";
import {useEffect, useState} from 'react'



function Dashbord() {
    const [data, setData] = useState(() => d3.ticks(-2, 2, 200).map(Math.sin));
    function onMouseMove(event) {
        const [x, y] = d3.pointer(event);
        setData(data.slice(-200).concat(Math.atan2(x, y)));
      }
    // const ticker = ["AAPL", "MSFT", "AMZN", "TSLA"]
    
    const [com, setCom] = useState({
        name:"name",
        per:10   
    });

    // useEffect(() => {
    //     fetch(`http://127.0.0.1:5000/AAPL`)
    //         .then((res) => res.json())
    //             .then(async (data) => {
    //                 let d = await data
    //                 setCom({
    //                     name:d.symbol,
    //                     per:d.volume
    //                 })
    //             })
    // }, [])

    // const [arr, setArr] = useState([])
    
    // const newData = (ticker) => {
    //     return ticker.map((tick) => {
            // fetch(`http://127.0.0.1:5000/${tick}`,
            // {
            //     'methords': 'GET',
            //     headers:{
            //         'Content-Type': 'application/json'
            //     }
            // })
            // .then((res) => res.json())
            //     .then(async (data) => {
            //         let d = await data
            //         setCom({
            //             name:d.symbol,
            //             per:d.volume
            //         })
            //     })
    //     })
    // }

    // const newData = ticker.map(async (tick) => {
    //     await fetch(`http://127.0.0.1:5000/${tick}`,
    //         {
    //             'methords': 'GET',
    //             headers:{
    //                 'Content-Type': 'application/json'
    //             }
    //         })
    //         .then((res) =>
    //             res.json())
    //             .then(async (data) => {
    //                 let d = await data
    //                 console.log(d)
    //                 setCom({
    //                     name:d.symbol,
    //                     per:d.volume
    //                 }, [])
    //             })
    // })

    // console.log(newData)

    // useEffect(() => {
    //     setArr()
    // }, [])
   

    // const getData = 
    //     ticker.map(async(tick) => {
    //         await fetch(`http://127.0.0.1:5000/${tick}`,
    //         {
    //             'methords': 'GET',
    //             headers:{
    //                 'Content-Type': 'application/json'
    //             }
    //         })
    //         .then((res) => res.json())
    //             .then(async (data) => {
    //                 let d = await data
    //                 setCom({
    //                     name:d.symbol,
    //                     per:d.volume
    //                 })
    //             })
    
    //     })

    

    return(
        <div onMouseMove={onMouseMove} style={{display:"flex", flexDirection:"column", padding:"30px"}}>
        <header>
            <TickerScroll props={com}/>
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