import { useEffect, useState } from 'react';
import './css/TickerScroll.css'

function TickerScroll({props}){
    const [gain, setGain] = useState([{
        ticker: "",
        per: 0
    }]);

    useEffect(() => {
        fetch("http://127.0.0.1:5000/gain")
        .then(res => res.json())
        .then((data) => {
            setGain(data)
        })
    })

    return(
        <div style={{width:"100%", color:"white"}}>
        <div id="scroll-text" >{gain.ticker} <span style={{color:"#0AD833"}}>{gain.per}</span></div>
        </div>
    )
}

export default TickerScroll;