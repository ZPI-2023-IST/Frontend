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
    const BOARD_ENPOINT = "/freecell";


    const [history, setHistory] = useState([]);

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
                console.log(data);
                // redirect to localhost:5005
                window.open(VISUALIZE_URL + ":" + VISUALIZE_PORT + BOARD_ENPOINT, "_blank");
            });
    }

    return (
        <Layout>
            <div className="table-container m-4">
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Game</th>
                        <th>State</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map((item, index) => (
                        <tr key={index}>
                            <td>{index}</td>
                            <td>{item['state']}</td>
                            <td>
                                <Button variant="primary" onClick={() => handleVisualize(index)}>
                                    Visualize
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            </div>
        </Layout>
    )
}
