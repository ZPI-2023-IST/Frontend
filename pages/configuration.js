import 'bootstrap/dist/css/bootstrap.min.css';
import Head from 'next/head';
import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import Layout from '../components/layout';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useState, useEffect } from "react";


export default function Configuration() {

  const API_URL = "http://localhost:5000";
  const ENDPOINT = "/config-params";

  const default_options = {
    "example": {}
  }

  const [algorithm, setAlgorithm] = useState("example");
  const [config, setConfig] = useState({});
  const [serverConfig, setServerConfig] = useState({});
  const [modConfig, setModConfig] = useState({});
  const [config_options, setConfigOptions] = useState(default_options);
  const [modConfigOptions, setModConfigOptions] = useState({});
  const [show, setShow] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [validated, setValidated] = useState(false); 
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [modify, setModify] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    fetch(API_URL + ENDPOINT)
      .then(response => response.json())
      .then(data => {
        setConfigOptions(data); 
        let new_algorithm = Object.keys(data)[0];
        setAlgorithm(new_algorithm); 

        let new_config = {};
        let config_keys = Object.keys(data[new_algorithm]);
        let config_values = Object.values(data[new_algorithm]);
        config_keys.forEach((key, index) => {
          new_config[key] = config_values[index][1];
        });
        setConfig(new_config);
      });

    fetch(API_URL + "/config")
    .then(response => response.json())
    .then(data => {
      setAlgorithm(data["algorithm"]);
      setConfig(data); 
    });

    fetch(API_URL + "/config-params?modifiable=1")
    .then(response => response.json())
    .then(data => {
      setModConfigOptions(data); 
    });

    fetch(API_URL + "/config?modifiable=1")
    .then(response => response.json())
    .then(data => {
      setModConfig(data); 
    });

  }, []);

  function handleConfigDisplay() {
    fetch(API_URL + "/config")
      .then(response => response.json())
      .then(data => {
        setServerConfig(data); 
      });
  };

  function fillDefaultConfig() {
    let new_config = {};
    let config_keys = Object.keys(config_options[algorithm]);
    let config_values = Object.values(config_options[algorithm]);
    config_keys.forEach((key, index) => {
      new_config[key] = config_values[index][1] ? config_values[index][1] : "";
    });
    setConfig(new_config);
  }

  function handleAlgorithmSelect(event) {
    setAlgorithm(event.target.value);
    let new_config = {};
    let config_keys = Object.keys(config_options[event.target.value]);
    let config_values = Object.values(config_options[event.target.value]);
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

  function handleModConfigUpdate(param){
    return (event) => {
      setModConfig({...modConfig, [param]: event.target.value});
    }
  }

  function handleCheckboxConfigUpdate(param){
    return (event) => {
      setConfig({...config, [param]: !config[param]});
    }
  }

  function handleModCheckboxConfigUpdate(param){
    return (event) => {
      setModConfig({...modConfig, [param]: !modConfig[param]});
    }
  }

  function handleInitialSubmit(mod) {
    return (event) => {
      setModify(mod);
      const form = event.currentTarget;
      event.preventDefault();
      if (form.checkValidity() === false) {
        event.stopPropagation();
      }
      else {
        handleShow();
      }
      setValidated(true);
    }
  }

  function handleSubmit(event) {
      handleClose();
      event.preventDefault();

      let config_params = modify ? modConfigOptions[algorithm] : config_options[algorithm];
      let currConfig = modify ? modConfig : config;
      let method = modify ? "PUT" : "POST";

      let config_keys = Object.keys(config_params);
      let config_values = Object.values(config_params);
      let response_config = {"algorithm": algorithm};
      config_keys.forEach((key, index) => {
        switch(config_values[index][0]){
        case "FLOAT":
          response_config[key] = parseFloat(currConfig[key]);
          break;
        case "INT":
          response_config[key] = parseInt(currConfig[key]);
          break;
        case "BOOL":
          response_config[key] = currConfig[key] === true;
          break;
        default:
          response_config[key] = currConfig[key];
        }
      });
      
      fetch(API_URL + "/config", {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify(response_config)
      })
        .then(response => {
          if(response.ok){
            setShowSuccess(true);
          }
          else{
            return response.json();
          }
        })
        .then(data => {
          if(data){
            setErrorMsg(data["error"]);
            setShowError(true);
          }
        });
  }
  

  function displayOption(key, index, alg, config_values, mod){
    let setConfigState = mod ? handleModConfigUpdate : handleConfigUpdate;
    let setCheckboxConfigState = mod ? handleModCheckboxConfigUpdate : handleCheckboxConfigUpdate;
    let config_state = mod ? modConfig : config;
    switch(config_values[index][0]){
      case "FLOAT":
        return (
          <Form.Group className="mb-3" key={alg + key}>
            <Form.Label> {key} </Form.Label>
            <Form.Control type="number" 
                          step="0.000000001" 
                          value={config_state[key]}
                          onChange={setConfigState(key)}
                          min={config_values[index][2]} 
                          max={config_values[index][3]} />
            <Form.Text className="text-muted">
              {config_values[index][4]}.&nbsp;
            </Form.Text>              
            {
              config_values[index][2] != null &&
              <Form.Text className="text-muted">
               Min value: {config_values[index][2]}.&nbsp;
              </Form.Text>
            }
            {
              config_values[index][3] != null &&
              <Form.Text className="text-muted">
               Max value: {config_values[index][3]}.&nbsp;
              </Form.Text>
            }
          </Form.Group>
        )
      case "INT":
        return (
          <Form.Group className="mb-3" key={alg + key}>
            <Form.Label> {key} </Form.Label>
            <Form.Control type="number" 
                          step="1" 
                          value={config_state[key]}
                          onChange={setConfigState(key)}
                          min={config_values[index][2]} 
                          max={config_values[index][3]} />
            <Form.Text className="text-muted">
              {config_values[index][4]}.&nbsp;
            </Form.Text> 
            {
              config_values[index][2] != null &&
              <Form.Text className="text-muted">
               Min value: {config_values[index][2]}.&nbsp;
              </Form.Text>
            }
            {
              config_values[index][3] != null &&
              <Form.Text className="text-muted">
               Max value: {config_values[index][3]}.&nbsp;
              </Form.Text>
            }
          </Form.Group>
        )
      case "BOOL":
        return (
          <Form.Group className="mb-3" key={alg + key}>
            <Form.Check type="checkbox" 
                        label={key} 
                        checked={config_state[key]}
                        onChange={setCheckboxConfigState(key)}/>
            <Form.Text className="text-muted">
              {config_values[index][4]}.&nbsp;
            </Form.Text> 
          </Form.Group>
        )
      default:
        return (
          <Form.Group className="mb-3" key={alg + key}>
            <Form.Label> {key} </Form.Label>
            <Form.Control type="text" 
                          value={config_state[key]}
                          onChange={setConfigState(key)} />
            <Form.Text className="text-muted">
              {config_values[index][4]}.&nbsp;
            </Form.Text>
          </Form.Group>
        )          
    }
  }
  

  function displayConfigOptions() {
    let config_params = config_options[algorithm];
    if(!config_params){
      return;
    }

    let config_keys = Object.keys(config_params);
    let config_values = Object.values(config_params);
    let alg = algorithm;

    return config_keys.map((key, index) => { 
      return displayOption(key, index, alg, config_values, false) 
    }); 
  }

  function displayModConfigOptions() { 
    let config_params = modConfigOptions[algorithm];
    if(!config_params){
      return;
    }
    let config_keys = Object.keys(config_params);
    let config_values = Object.values(config_params);
    let alg = algorithm;

    return config_keys.map((key, index) => { 
      return displayOption(key, index, alg, config_values, true) 
    }); 
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
        {Object.keys(serverConfig).map((key) => { return <p>{key}: {serverConfig[key] ? serverConfig[key].toString() : "null"}</p> })}
      </Popover.Body>
    </Popover>
  );

  return (
    <Layout>
      <Container className='m-4' >
        <Stack gap={3} className="col-md-5 mx-auto">
          <Alert variant="success" show={showSuccess} onClose={() => setShowSuccess(false)} dismissible>
            Configuration updated!
          </Alert>
          <Alert variant="danger" 
                   show={showError} 
                   onClose={() => setShowError(false)} 
                   dismissible>
              {errorMsg}
            </Alert>
          <h1>Configuration</h1>

          <Tabs
            defaultActiveKey="new"
            id="uncontrolled-tab-example"
            className="mb-3"
          >
            <Tab eventKey="new" title="New config" className="">

              <Form noValidate validated={validated} onSubmit={handleInitialSubmit(false)} id="form">
                <Form.Group className="mb-3" controlId="formAlgorithm">
                  <Form.Label> Algorithm </Form.Label>
                  <Form.Select aria-label="Default select example" 
                              defaultValue="example" 
                              onChange={handleAlgorithmSelect}
                              value={algorithm}>
                    { Object.keys(config_options).map(renderOption) }
                  </Form.Select>
                  <Button variant="outline-secondary" size="sm" onClick={fillDefaultConfig} className="mt-3">
                    Fill default
                  </Button>
                </Form.Group>
                
                {displayConfigOptions()}
              </Form>

              <Button variant="primary" type="submit" form='form' className='w-100'>
                  Create config
              </Button>
            </Tab>

            <Tab eventKey="modify" title="Modify config">
              <Form noValidate validated={validated} onSubmit={handleInitialSubmit(true)} id="form-mod">           
                {displayModConfigOptions()}
              </Form>
              <Button variant="primary" type="submit" form='form-mod' className='w-100'>
                  Update config
              </Button>
            </Tab>
          </Tabs>

          <OverlayTrigger trigger="click" placement="top" overlay={popover}>
            <Button variant="secondary" onClick={handleConfigDisplay}>
              Current config
            </Button>
          </OverlayTrigger>


        </Stack>
      </Container>

      <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Update config</Modal.Title>
          </Modal.Header>
          <Modal.Body>Updating configuration will reset all weights of current model. Are you sure?</Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleClose}>
              Nahh
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              DO IT!
            </Button>
          </Modal.Footer>
        </Modal>

    </Layout>
  );
}
