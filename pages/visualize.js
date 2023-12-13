import Port from "../components/port";
import ListGroup from 'react-bootstrap/ListGroup';
import Layout from '../components/layout'
import Button from 'react-bootstrap/Button';
import { Table } from 'react-bootstrap';
import { useState, useEffect } from "react";

export default function Visualize() {
    const API_URL = "http://localhost";
    const PORT = Port();
    const HISTORY_ENDPOINT = "/game-history";

    const VISUALIZE_URL = "http://localhost";
    const VISUALIZE_PORT = "5005";
    const VISUALIZE_ENDPOINT = "/api/visualize";

    const [history, setHistory] = useState([]);
    const [filter, setFilter] = useState(['WON', 'LOST', 'TIMEOUT']);

    useEffect(() => {
        fetch(API_URL + ":" + PORT + HISTORY_ENDPOINT)
            .then(response => response.json())
            .then(data => {
                setHistory(data["history"]);
            });
    }, []);


    function handleVisualize(index) {
        fetch(VISUALIZE_URL + ":" + VISUALIZE_PORT + VISUALIZE_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(history[index]['game'])
        })
            .then(response => response.json())
            .then(data => {
                const endpoint = data['url'];
                // redirect to localhost:5005
                window.open(VISUALIZE_URL + ":" + VISUALIZE_PORT + endpoint, "_blank");
            });
    }

    function handleFilterChange(newFilter) {
        if (filter.includes(newFilter)) {
            setFilter(filter.filter(item => item !== newFilter));
        }
        else {
            setFilter([...filter, newFilter]);
        }
    }
    return (
        <Layout>
            { (history.length > 0) &&
            <div className="table-container m-4">
                <div style={{display: 'flex', marginInline: 'auto', marginBottom: '1em'}}>
                    <Button variant={filter.includes('WON') ? "primary" : "outline-primary"} onClick={() => handleFilterChange('WON')} className="m-1">WON</Button>
                    <Button variant={filter.includes('LOST') ? "primary" : "outline-primary"} onClick={() => handleFilterChange('LOST')} className="m-1">LOST</Button>
                    <Button variant={filter.includes('TIMEOUT') ? "primary" : "outline-primary"} onClick={() => handleFilterChange('TIMEOUT')} className="m-1">TIMEOUT</Button>
                </div>                
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Game</th>
                        <th>Time</th>
                        <th>State</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map((item, index) => {
                        return (filter.includes(item['state']) && 
                        <tr key={index}>
                            <td>{index}</td>
                            <td>{item['timestamp']}</td>
                            <td>{item['state']}</td>
                            <td>
                                <Button variant="primary" onClick={() => handleVisualize(index)}>
                                    Visualize
                                </Button>
                            </td>
                        </tr>
                        );
                    })}
                </tbody>
            </Table>
            </div>
            }
            {  (history.length === 0) &&
            <div className="text-center mt-5">
                <h1 className="mb-4">No game history found</h1>
                <p>Play a game in test mode and come back later</p>
            </div>
            }
        </Layout>
    )
}
