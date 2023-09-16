import './css/TickerScroll.css'

function TickerScroll(){
    return(
        <div style={{display:"flex", justifyContent:"space-between"}}>
        <div id="scroll-container">
        <div id="scroll-text">APPL <span style={{color:"#0AD833"}}>12%</span></div>
        </div>
        <div style={{display:"flex", gap:"15px", alignItems:"center", marginRight:"30px"}}>
            <div style={{backgroundColor:"white", width:"50px", height:"50px", borderRadius:"50%"}}></div>
            <h2 style={{color:"white", margin:"0"}}>Suryank</h2>
        </div>
        </div>
    )
}

export default TickerScroll;