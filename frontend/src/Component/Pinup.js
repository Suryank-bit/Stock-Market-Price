function Pinup(props) {
    return (
        <div style={{backgroundColor:"#1A1624", color:"white", borderRadius:"20px", width:"fit-content", display:"grid", gridTemplate:"1fr 1fr 1fr",paddingLeft:"20px", paddingRight:"20px", margin:"20px"}}>
                <h3 style={{marginBottom:"0", display:"flex", justifyContent:"space-between"}}>NIFTY <p style={{margin:"0", color:"#0AD833"}}>1.46%</p></h3>
            <span style={{width:"fit-content", display:"flex", gap:"20px"}}>
                <h5>open <p>12.5</p></h5>
                <h5>close <p>34.5</p></h5>
                <h5>high <p>65.6</p></h5>
                <h5>low <p>54</p></h5>
            </span>
        </div>
    )
}

export default Pinup;