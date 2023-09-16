import "./css/Chart.css"
import {useState} from"react"
import * as d3 from "d3"


function Chart({
    data,
    width = 640,
    height = 400,
    marginTop = 20,
    marginRight = 20,
    marginBottom = 20,
    marginLeft = 20
}) {
    
    const x = d3.scaleLinear([0, data.length - 1], [marginLeft, width - marginRight]);
    const y = d3.scaleLinear(d3.extent(data), [height - marginBottom, marginTop]);
    const line = d3.line((d, i) => x(i), y);
    var today = new Date(),
    date = today.getDate() + '/ ' + today.getMonth() + '/' + today.getFullYear()
    const [startDate, setStartDate] = useState(date)
    const [endDate, setEndDate] = useState(date)
    const [graphType, setGraphType] = useState('')

    return(
        <div className="chart-section">
            <div className="main-chart">
                <svg width={width} height={height}>
                    <path fill="none" stroke="currentColor" stroke-width="1.5" d={line(data)} />
                    <g fill="white" stroke="currentColor" stroke-width="1.5">
                        {data.map((d,i) => (<circle key={i} cx={x(i)} cy={y(d)} r="2.5" />))}
                    </g>
                </svg>
            </div>
            <div className="chart-control">
                <form>
                    <div className="date-section">
                        <label>
                            From 
                            <input type="date" value={startDate}/>
                        </label>
                        <label>
                            To
                            <input type="date" value={endDate}/>
                        </label>
                    </div>
                    <label>
                        Graph Type
                        <select>
                            <option value='candel-stick'>Candel Stick</option>
                            <option value='line'>Line Graph</option>
                            <option value='Bar'>Bar Graph</option>
                        </select>
                    </label>
                    <label>
                        Import Last Setting
                        <button>Import</button>
                    </label>
                    <label>
                        Save Setting
                        <button>Save</button>
                    </label>
                </form>
            </div>
        </div>
    )
}

export default Chart;