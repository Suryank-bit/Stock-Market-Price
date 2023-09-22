import "./css/Chart.css"
import {useEffect, useMemo, useState} from"react"
import data from "./query.json"
import CandlestickChart from "./Candle"





function Chart(props) {
    const [startDate, setStartDate] = useState()
    const [endDate, setEndDate] = useState()
    const [ticker, setTicker] = useState()

    const [stockData, setStockData] = useState()

    fetch("http://127.0.0.1:5000/stockDaily")
    .then(res => res.json())
    .then(data => setStockData(data))


    const formatStockData = (stockData) => {
        const formattedData = []

        if (stockData['Time Series (Daily)']) {
            Object.entries(
                stockData['Time Series (Daily)']
            ).map(
                ([key, value]) =>
                {
                    formattedData.push({
                        date: key,
                        open:Number(value['1. open']),
                        high:Number(value['2. high']),
                        low:Number(value['3. low']),
                        close:Number(value['4. close']),
                        volume:Number(value['5. volume'])
                    })
                }
            )
        }
        return formattedData
    }


    const handleSubmit = () => {
        fetch("http://127.0.0.1:5000/settings", {
            method: 'PUT',
            body : JSON.stringify({
                start_date: startDate,
                end_date: endDate,
                ticker: ticker
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        }).then((res) => res.json())
        .catch((err) => console.log(err))

        fetch("http://127.0.0.1:5000/cutomTable", {
            method: 'PUT',
            body : JSON.stringify({
                start_date: startDate,
                end_date: endDate,
                ticker: ticker
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        }).then((res) => res.json())
        .catch((err) => console.log(err))
    }

    // const handleImport = () => {
    //     fetch("http://127.0.0.1:5000/settings/1")
    //     .then((res) => res.json())
    //     .then((data) => {
    //         console.log(data)
    //         setStartDate(data['setting']['start_date'])
    //         setEndDate(data['setting']['end_date'])
    //         setTicker(data['setting']['ticker'])
    //     })
    //     .catch((err) => console.log(err))
    // }

    const [chartData, setChartData] = useState({})

    // const chartData = useMemo(() => formatStockData(stockData), [stockData])

    const handleImport = () => {
        setChartData()
    }

    return(
        <div className="chart-section">
            <div className="main-chart">
                <CandlestickChart data={chartData} />
            </div>
            <div className="chart-control">
                <form>
                    <div className="date-section">
                        <label>
                            From 
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </label>
                        <label>
                            To
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}    
                            />
                        </label>
                    </div>
                    <div className="ticker">
                        <label>
                            Ticker
                            <input
                                type="text"
                                value={ticker}
                                onChange={(e) => setTicker(e.target.value)}
                            />
                        </label>
                    </div>
                    <label>
                        Apply
                        <button onClick={handleImport}>Apply</button>
                    </label>
                    <label>
                        Save Data
                        <button onClick={handleSubmit}>Save</button>
                    </label>
                </form>
            </div>
        </div>
    )
}

export default Chart;