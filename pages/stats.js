import Port from "../components/port";
import { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import Chart from 'chart.js/auto';
import { Container, Row, Col } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import Layout from "../components/layout";


export default function Stats() {
    const API_URL = "http://localhost";
    const PORT = Port();
    const STATS_ENDPOINT = "/stats";

    const [rewards, setRewards] = useState([]);
    const [wins, setWins] = useState([]);
    const [losses, setLosses] = useState([]);
    const [timeouts, setTimeouts] = useState([]);
    const [smoothing, setSmoothing] = useState(1);

    useEffect(() => {
        fetch(API_URL + ":" + PORT + STATS_ENDPOINT)
            .then(response => response.json())
            .then(data => {
                setRewards(data["CurrentGameRewards"]);
                setWins(data["NoWonGames"]);
                setLosses(data["NoLostGames"]);
                setTimeouts(data["NoTimeouts"]);
            });
    }, []);


    function movingAverage(values, N) {
        let i = 0;
        let sum = 0;
        N = Math.min(N, values.length);
        const means = new Float64Array(values.length).fill(NaN);
        for (let n = Math.min(N - 1, values.length); i < n; ++i) {
            sum += values[i];
            means[i] = sum / (i + 1);
        }
        for (let n = values.length; i < n; ++i) {
            sum += values[i];
            means[i] = sum / N;
            sum -= values[i - N + 1];
        }
        return means;
    }


    function processRewards(rewards) {
        var newData = movingAverage(rewards, smoothing);
        return {
            labels: newData.map((item, index) => index),
            datasets: [
                {
                    label: "Rewards",
                    data: newData,
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }
            ]
        };
    }

    function proccessGameResults(wins, losses, timeouts) {
        return {
            labels: ["Wins", "Losses", "Timeouts"],
            datasets: [
                {
                    label: "Game Results",
                    data: [wins, losses, timeouts],
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgb(75, 192, 192)',
                        'rgb(255, 99, 132)',
                        'rgb(255, 159, 64)'
                    ],
                    borderWidth: 1
                }
            ]
        };
    }


    function LineChart({ chartData }) {
        return (
            <div className="chart-container">
              <h2 style={{ textAlign: "center" }}>Rewards</h2>
              <Line
                data={chartData}
                options={{
                  plugins: {
                    legend: {
                      display: false
                    }
                  }
                }}
              />
            </div>
        );
    }

    function BarChart({ chartData }) {
        return (
            <div className="chart-container">
              <h2 style={{ textAlign: "center" }}>Game results</h2>
              <Bar
                data={chartData}
                options={{
                  plugins: {
                    legend: {
                      display: false
                    }
                  }
                }}
              />
            </div>
        );
    }

    return (
        <Layout>
         <Container>
            <Row>
                <Col md={{ span: 8, offset: 2 }} className="text-center mt-5">
                    <LineChart chartData={processRewards(rewards)} />
                    <Form.Label>Smoothing</Form.Label>
                    <Form.Range min={1} max={10} value={smoothing} onChange={(e) => setSmoothing(e.target.value)} />
                </Col>
            </Row>
            <Row>
                <Col md={{ span: 8, offset: 2 }} className="text-center mt-5 mb-5">
                    <BarChart chartData={proccessGameResults(wins, losses, timeouts)} />
                </Col>
            </Row>
        </Container>
        </Layout>
    )
}
