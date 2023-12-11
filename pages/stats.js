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
    const [game, setGame] = useState(0);
    const [numGames, setNumGames] = useState(0);
    const [allData, setAllData] = useState([]);

    function compareNames(a, b) {
        if(a["Name"] == "Current")
            return 1;
        if(b["Name"] == "Current")
            return -1;

        a = a["Name"].split("_")[2];
        b = b["Name"].split("_")[2];
        
        // change format of dates
        a = a.replaceAll("-", "T").replaceAll("/", "-");
        b = b.replaceAll("-", "T").replaceAll("/", "-");

        a = Date.parse(a);
        b = Date.parse(b);

        console.log(a);
        console.log(b);

        return a - b;
    }

    useEffect(() => {
        fetch(API_URL + ":" + PORT + STATS_ENDPOINT)
            .then(response => response.json())
            .then(data => {
               
                data.sort((a, b) => compareNames(a, b));
                
                data = data.reverse();
                if (data.length === 0) {
                    return;
                }
                setRewards(data[game]["AllGameRewardsSummed"]);
                setWins(data[game]["NoWonGames"]);
                setLosses(data[game]["NoLostGames"]);
                setTimeouts(data[game]["NoTimeouts"]);

                setNumGames(data.length);
                setAllData(data);
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
        const MAX_DATAPOINTS = 10000;
        const sample_rate = Math.ceil(rewards.length / MAX_DATAPOINTS);
        rewards = rewards.filter((item, index) => index % sample_rate === 0);
        var newData = movingAverage(rewards, smoothing);
        return {
            labels: newData.map((item, index) => index * sample_rate),
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
                  },
                  scales: {
                    x: {
                      display: true,
                      title: {
                        display: true,
                        text: 'Episode'
                        }
                    },
                    y: {
                      display: true,
                      title: {
                        display: true,
                        text: 'Cumulative Reward'
                        }
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

    function handleGameChange(event) {
        setGame(event.target.value);
        setRewards(allData[event.target.value]["AllGameRewardsSummed"]);
        setWins(allData[event.target.value]["NoWonGames"]);
        setLosses(allData[event.target.value]["NoLostGames"]);
        setTimeouts(allData[event.target.value]["NoTimeouts"]);
    }

    return (
        <Layout>
         <Container>
            <Row>
                <Col md={{ span: 8, offset: 2 }} className="text-center mt-5">
                    <Form.Label>Game</Form.Label>
                    <Form.Select value={game} onChange={handleGameChange}>
                        {Array.from(Array(numGames).keys()).map((item, index) => <option key={index} value={index}> {allData[index]["Name"]} </option>)}
                    </Form.Select>
                </Col>
            </Row>
            <Row>
                <Col md={{ span: 8, offset: 2 }} className="text-center mt-5">
                    <LineChart chartData={processRewards(rewards)} />
                    <Form.Label className="mt-3">Smoothing</Form.Label>
                    <Form.Range min={1} max={rewards.length > 100 ? 100 : rewards.length} value={smoothing} onChange={(e) => setSmoothing(e.target.value)} />
                </Col>
            </Row>
            <Row>
                <Col md={{ span: 8, offset: 2 }} className="text-center mt-5 mb-5 pb-5">
                    <BarChart chartData={proccessGameResults(wins, losses, timeouts)} />
                </Col>
            </Row>
        </Container>
        </Layout>
    )
}
