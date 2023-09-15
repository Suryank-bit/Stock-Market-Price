import "./css/Chart.css"
// import {useState} from"react"


function Chart() {

    // var today = new Date(),
    // date = today.getDate() + '/ ' + today.getMonth() + '/' + today.getFullYear()
    // const [startDate, setStartDate] = useState(date)
    // const [endDate, setEndDate] = useState(date)

    return(
        <div className="chart-section">
            <div className="main-chart">
                    <select>
                        <option value='candel-stick'>Candel Stick</option>
                        <option value='line'>Line Graph</option>
                        <option value='Bar'>Bar Graph</option>
                    </select>
                </div>
            <div className="chart-control">
                <form>
                    <label>
                        From <input type="date" />
                        To <input type="date" />
                    </label>
                </form>
            </div>
        </div>
    )
}

export default Chart;