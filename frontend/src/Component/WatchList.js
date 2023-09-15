import "./css/WatchList.css"

function WatchList() {
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
                    </tr>
                </thead>
            </table>
        </div>
    )
}

export default WatchList;