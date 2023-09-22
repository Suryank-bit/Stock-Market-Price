import { color } from "d3";
import { useState, useEffect } from "react";

function Pinup(props) {


    const [data, setData] = useState({
        '2. open': 123,
        '3. high': 121,
        '4. low': 120,
        '5. close': 110,
        '9. change': 2,
        '10. change percent': "-12%"
    })

    useEffect(() => {
        fetch('http://127.0.0.1:5000/dailyQuote', {
            method:'POST',
            body: JSON.stringify({
                symbol: props.ticker
            }),
            headers: {
                'Content-type': 'application/json;',
            }
        }).then((res) => res.json())
        .then((data) => {
            setData(data)
        })
    }, [])

    return (
        <div style={{backgroundColor:"#1A1624", color:"white", borderRadius:"20px", width:"fit-content", display:"grid", gridTemplate:"1fr 1fr 1fr",paddingLeft:"20px", paddingRight:"20px",marginTop:"40px"}}>
                <h3 style={{marginBottom:"0", display:"flex", justifyContent:"space-between"}}>{props.ticker} <p style={{margin:"0", color: data['9. change'] > 0 ? '#0AD833' : 'red'}}>{data['10. change percent']}</p></h3>
            <span style={{width:"fit-content", display:"flex", gap:"20px"}}>
                <h5>open <p>{data['2. open']}</p></h5>
                <h5>high <p>{data['3. high']}</p></h5>
                <h5>low <p>{data['4. low']}</p></h5>
                <h5>close <p>{data['5. close']}</p></h5>
            </span>
        </div>
    )
}

export default Pinup;