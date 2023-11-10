import 'bootstrap/dist/css/bootstrap.min.css';
import Head from 'next/head';
import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';
import { useState } from "react";

import Layout from '../components/layout';


export default function Configuration() {
  const default_options = {
    "dqn": {
      "train": {
        "lr": "FLOAT",
      },
      "test": {}
    },
    "random": {
      "train": {},
      "test": {}
    }
  }

  const [algorithm, setAlgorithm] = useState("dqn");
  const [mode, setMode] = useState("train");
  const [config_options, setConfigOptions] = useState(default_options);

  function handleAlgorithmSelect(event) {
    setAlgorithm(event.target.value);
  }
  
  function handleModeSelect(event) {
    setMode(event.target.value);
  }

  function displayConfigOptions() {
    let config = config_options[algorithm][mode];
    let config_keys = Object.keys(config);
    let config_values = Object.values(config);
    return config_keys.map((key, index) => 
      (
        <Form.Group className="mb-3" controlId={key}>
          <Form.Label> {key} </Form.Label>
          <Form.Control type="text" placeholder={config_values[index]} />
        </Form.Group>
      )
    ); 
  }

  return (
    <Layout>
      <Head>
        <title>Reinforcement learning</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Container className='m-4' >
        <Stack gap={3} className="col-md-5 mx-auto">
          <h1>Configuration</h1>

          <Form.Group className="mb-3" controlId="formAlgorithm">
            <Form.Label> Algorithm </Form.Label>
            <Form.Select aria-label="Default select example" onChange={handleAlgorithmSelect}>
              <option>Open this select menu</option>
              <option value="dqn">DQN</option>
              <option value="random">Random</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formMode">
            <Form.Label>Mode</Form.Label>
            <Form.Select aria-label="Default select example" onChange={handleModeSelect}>
              <option>Open this select menu</option>
              <option value="train">Train</option>
              <option value="test">Test</option>
            </Form.Select>
          </Form.Group>
          {displayConfigOptions()}
        </Stack>
      </Container>
    </Layout>
  );
}
