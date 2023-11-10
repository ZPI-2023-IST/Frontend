import 'bootstrap/dist/css/bootstrap.min.css';
import Head from 'next/head';
import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';
import { useState } from "react";

import Layout from '../components/layout';


export default function Configuration() {
  const config_options = {
    "dqn": {
      "train": {
        "lr": ["FLOAT", 0, 0, 1],
        "optimizer": ["STRING", "Adam", null, null],
        "some int": ["INT", 0, 0, 10],
        "some bool": ["BOOL", false, null, null],
      },
      "test": {
        "optimizer": ["STRING", "Adam", null, null],
      }
    },
    "random": {
      "train": {},
      "test": {}
    }
  }

  const [algorithm, setAlgorithm] = useState("dqn");
  const [mode, setMode] = useState("train");

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
    return config_keys.map((key, index) => {
      switch(config_values[index][0]){
        case "FLOAT":
          return (
            <Form.Group className="mb-3" controlId={key}>
              <Form.Label> {key} </Form.Label>
              <Form.Control type="number" 
                            step="0.01" 
                            placeholder={config_values[index][1]} 
                            min={config_values[index][2]} 
                            max={config_values[index][3]} />
              {
                config_values[index][2] != null && config_values[index][3] != null &&
                <Form.Text className="text-muted">
                  Value range: {config_values[index][2]} - {config_values[index][3]}
                </Form.Text>
              }
            </Form.Group>
          )
        case "INT":
          return (
            <Form.Group className="mb-3" controlId={key}>
              <Form.Label> {key} </Form.Label>
              <Form.Control type="number" 
                            step="1" 
                            placeholder={config_values[index][1]} 
                            min={config_values[index][2]} 
                            max={config_values[index][3]} />
              {
                config_values[index][2] != null && config_values[index][3] != null &&
                <Form.Text className="text-muted">
                  Value range: {config_values[index][2]} - {config_values[index][3]}
                </Form.Text>
              }
            </Form.Group>
          )
        case "BOOL":
          return (
            <Form.Group className="mb-3" controlId={key}>
              <Form.Check type="checkbox" label={key} defaultChecked={config_values[index][1]} />
            </Form.Group>
          )
        default:
          return (
            <Form.Group className="mb-3" controlId={key}>
              <Form.Label> {key} </Form.Label>
              <Form.Control type="text" placeholder={config_values[index][1]} />
            </Form.Group>
          )          
      }
    }
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
            <Form.Select aria-label="Default select example" 
                         defaultValue="dqn" 
                         onChange={handleAlgorithmSelect}>
              <option value="dqn">DQN</option>
              <option value="random">Random</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formMode">
            <Form.Label>Mode</Form.Label>
            <Form.Select aria-label="Default select example" 
                         defaultValue="train" 
                         onChange={handleModeSelect}>
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
