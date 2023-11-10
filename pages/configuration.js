import 'bootstrap/dist/css/bootstrap.min.css';
import Head from 'next/head';
import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';
import { useState, useEffect } from "react";

import Layout from '../components/layout';


export default function Configuration() {

  const API_URL = "http://localhost:5000";
  const ENDPOINT = "/config-params";

  const default_options = {
    "example": {
      "train": {},
      "test": {}
    }
  }

  const [algorithm, setAlgorithm] = useState("example");
  const [mode, setMode] = useState("train");
  const [config_options, setConfigOptions] = useState(default_options);

  useEffect(() => {
    fetch(API_URL + ENDPOINT)
      .then(response => response.json())
      .then(data => {console.log(data); setConfigOptions(data); 
        setAlgorithm(Object.keys(data)[0]);
      });
  }, []);

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

  function renderOption(value) {
    return (
      <option value={value}>{value}</option>
    )
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
                         defaultValue="example" 
                         onChange={handleAlgorithmSelect}>
              { Object.keys(config_options).map(renderOption) }
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formMode">
            <Form.Label>Mode</Form.Label>
            <Form.Select aria-label="Default select example" 
                         defaultValue="test" 
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