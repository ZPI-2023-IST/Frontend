import 'bootstrap/dist/css/bootstrap.min.css';
import Head from 'next/head';
import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from "react";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
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
  const [config, setConfig] = useState({});
  const [serverConfig, setServerConfig] = useState({});
  const [config_options, setConfigOptions] = useState(default_options);

  useEffect(() => {
    fetch(API_URL + ENDPOINT)
      .then(response => response.json())
      .then(data => {
        setConfigOptions(data); 
        let new_algorithm = Object.keys(data)[0];
        let new_mode = Object.keys(data[new_algorithm])[0];
        setAlgorithm(new_algorithm); 
        setMode(new_mode);

        let new_config = {};
        let config_keys = Object.keys(data[new_algorithm][new_mode]);
        let config_values = Object.values(data[new_algorithm][new_mode]);
        config_keys.forEach((key, index) => {
          new_config[key] = config_values[index][1];
        });
        setConfig(new_config);
      });
  }, []);

  function handleConfigDisplay() {
    fetch(API_URL + "/config")
      .then(response => response.json())
      .then(data => {
        setServerConfig(data); 
      });
  };

  function handleAlgorithmSelect(event) {
    setAlgorithm(event.target.value);
    let new_config = {};
    let config_keys = Object.keys(config_options[event.target.value][mode]);
    let config_values = Object.values(config_options[event.target.value][mode]);
    config_keys.forEach((key, index) => {
      new_config[key] = config_values[index][1];
    });
    setConfig(new_config);
  }
  
  function handleModeSelect(event) {
    setMode(event.target.value);
    let new_config = {};
    let config_keys = Object.keys(config_options[algorithm][event.target.value]);
    let config_values = Object.values(config_options[algorithm][event.target.value]);
    config_keys.forEach((key, index) => {
      new_config[key] = config_values[index][1];
    });
    setConfig(new_config);
  }

  function handleConfigUpdate(param){
    return (event) => {
      setConfig({...config, [param]: event.target.value});
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    let config_params = config_options[algorithm][mode];
    let config_keys = Object.keys(config_params);
    let config_values = Object.values(config_params);
    let response_config = {"algorithm": algorithm, "mode": mode};
    config_keys.forEach((key, index) => {
      switch(config_values[index][0]){
      case "FLOAT":
        response_config[key] = parseFloat(config[key]);
        break;
      case "INT":
        response_config[key] = parseInt(config[key]);
        break;
      case "BOOL":
        response_config[key] = config[key] === "true";
        break;
      default:
        response_config[key] = config[key];
      }
    });
    fetch(API_URL + "/config", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(response_config)
    })
  }

  function displayConfigOptions() {
    let config_params = config_options[algorithm][mode];
    let config_keys = Object.keys(config_params);
    let config_values = Object.values(config_params);
    let alg = algorithm;
    let md = mode;

    return config_keys.map((key, index) => {
      switch(config_values[index][0]){
        case "FLOAT":
          return (
            <Form.Group className="mb-3" key={alg + md + key}>
              <Form.Label> {key} </Form.Label>
              <Form.Control type="number" 
                            step="0.01" 
                            value={config[key]}
                            onChange={handleConfigUpdate(key)}
                            min={config_values[index][2]} 
                            max={config_values[index][3]} />
              {
                config_values[index][2] != null && config_values[index][3] != null &&
                <Form.Text className="text-muted">
                  Value range: from {config_values[index][2]} to {config_values[index][3]}
                </Form.Text>
              }
            </Form.Group>
          )
        case "INT":
          return (
            <Form.Group className="mb-3" key={alg + md + key}>
              <Form.Label> {key} </Form.Label>
              <Form.Control type="number" 
                            step="1" 
                            value={config[key]}
                            onChange={handleConfigUpdate(key)}
                            min={config_values[index][2]} 
                            max={config_values[index][3]} />
              {
                config_values[index][2] != null && config_values[index][3] != null &&
                <Form.Text className="text-muted">
                  Value range: from {config_values[index][2]} to {config_values[index][3]}
                </Form.Text>
              }
            </Form.Group>
          )
        case "BOOL":
          return (
            <Form.Group className="mb-3" key={alg + md + key}>
              <Form.Check type="checkbox" 
                          label={key} 
                          value={config[key]}
                          onChange={handleConfigUpdate(key)}/>
            </Form.Group>
          )
        default:
          return (
            <Form.Group className="mb-3" key={alg + md + key}>
              <Form.Label> {key} </Form.Label>
              <Form.Control type="text" 
                            value={config[key]}
                            onChange={handleConfigUpdate(key)} />
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

  const popover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">Configuration</Popover.Header>
      <Popover.Body>
        {Object.keys(serverConfig).map((key) => { return <p>{key}: {serverConfig[key] || "null"}</p> })}
      </Popover.Body>
    </Popover>
  );

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
          <Button variant="primary" type="submit" onClick={handleSubmit}>
            Update config
          </Button>
          <OverlayTrigger trigger="click" placement="top" overlay={popover}>
            <Button variant="secondary" onClick={handleConfigDisplay}>
              Current config
            </Button>
          </OverlayTrigger>

        </Stack>
      </Container>
    </Layout>
  );
}
