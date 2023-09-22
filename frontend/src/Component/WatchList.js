import { useEffect, useState } from "react"
import "./css/WatchList.css"
import AddDataModal from "./Popup";

function WatchList(props) {

    const [isModalOpen, setModalOpen] = useState(false);

    const [watchData, setWatchData] = useState([])

    const openModal = () => {
        setModalOpen(true);
    };
    
    const closeModal = () => {
        setModalOpen(false);
    };

    useEffect(() => {
        fetch(`http://127.0.0.1:5000/watchlist/${props.id}`)
        .then(res => res.json())
        .then(data => setWatchData(data))
        
    },[])

    const handleSubmit = (data) => {
        fetch("http://127.0.0.1:5000/watchlist", {
            method: 'POST',
            body: ({
                ticker: data
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        }).then(res => res.json())
        .then((data) => setWatchData([...watchData, data]))
        
    };

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
            Ticker:"TSLA",
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
                    <tr className="heading">
                        <th colSpan={5}><b>WatchList <a onClick={openModal} style={{textDecoration:"none", color:"white", cursor:'pointer'}}>+</a></b></th>
                    </tr>
                    <tr>
                        <th>Ticker</th>
                        <th>Open</th>
                        <th>Close</th>
                        <th>High</th>
                        <th>Low</th>
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
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <AddDataModal isOpen={isModalOpen} onClose={closeModal} onSubmit={handleSubmit} />
            <ul>
                {watchData.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </div>
    )
}

export default WatchList;