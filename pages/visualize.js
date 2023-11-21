import Port from "../components/port";
import ListGroup from 'react-bootstrap/ListGroup';
import Layout from '../components/layout'
import Button from 'react-bootstrap/Button';
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
            body: JSON.stringify(history[index])
        })
            .then(response => response.json())
            .then(data => {
                // redirect to localhost:5005
                window.open(VISUALIZE_URL + ":" + VISUALIZE_PORT + BOARD_ENPOINT, "_blank");
            });
    }

    return (
        <Layout>
            <ListGroup>
                {history.map((item, index) => (
                    <ListGroup.Item key={index}>
                        <div className="row">
                            <div className="col-2">
                                <p>Game {index} </p>
                            </div>
                            <div className="col-10">
                                <Button variant="primary" onClick={() => handleVisualize(index)}>Visualize</Button>
                            </div>
                        </div>
                    </ListGroup.Item>
                ))    
                }
            </ListGroup>
        </Layout>
    )
}
