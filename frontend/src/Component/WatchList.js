import "./css/WatchList.css"

function WatchList() {

    const stocks = [
        {
            Ticker:"APPL",
            Open:123.5,
            Close:1232.5,
            High:324.4,
            Low:324,
            per: -23,
            key:1,
        },
        {
            Ticker:"MSFT",
            Open:143.5,
            Close:3232.5,
            High:624.4,
            Low:224,
            per: 23,
            key:2
        },
        {
            Ticker:"TSL",
            Open:234.5,
            Close:632.5,
            High:544.4,
            Low:244,
            per: 31,
            key:3
        },
    ]

    return(
        <div className="WatchList-Table">
            <table>
                <thead>
                    <tr>
                        <th>Ticker</th>
                        <th>Open</th>
                        <th>Close</th>
                        <th>High</th>
                        <th>Low</th>
                        <th>Per Cent</th>
                    </tr>
                </thead>
                <tbody>
                    {stocks.map(data => {
                        return (
                            <tr key={data.key}>
                                <td>{data.Ticker}</td>
                                <td>{data.Open}</td>
                                <td>{data.Close}</td>
                                <td>{data.High}</td>
                                <td>{data.Low}</td>
                                <td>{data.per}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default WatchList;