import 'bootstrap/dist/css/bootstrap.min.css';
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
import Config from '../components/config';

export default function Configuration() {
  const API_URL = Config()["rl_host"];
  const PORT = Config()["rl_port"];
  const OPTIONS_ENDPOINT = "/config-params";
  const CONFIG_ENDPOINT = "/config";

  const defaultOptions = {
    "example": {}
  }

  const [algorithm, setAlgorithm] = useState("example");
  const [config, setConfig] = useState({});
  const [serverConfig, setServerConfig] = useState({});
  const [modConfig, setModConfig] = useState({});
  const [configOptions, setConfigOptions] = useState(defaultOptions);
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
    fetch(API_URL + ":" + PORT + OPTIONS_ENDPOINT)
      .then(response => response.json())
      .then(data => {
        setConfigOptions(data); 
        let newAlgorithm = Object.keys(data)[0];
        setAlgorithm(newAlgorithm); 

        let newConfig = {};
        let configKeys = Object.keys(data[newAlgorithm]);
        let configValues = Object.values(data[newAlgorithm]);
        configKeys.forEach((key, index) => {
          newConfig[key] = configValues[index][1];
        });
        setConfig(newConfig);
      });

    fetch(API_URL + ":" + PORT + CONFIG_ENDPOINT)
    .then(response => response.json())
    .then(data => {
      setAlgorithm(data["algorithm"]);
      setConfig(data); 
    });

    fetch(API_URL + ":" + PORT + OPTIONS_ENDPOINT + "?modifiable=1")
    .then(response => response.json())
    .then(data => {
      setModConfigOptions(data); 
    });

    fetch(API_URL + ":" + PORT + CONFIG_ENDPOINT + "?modifiable=1")
    .then(response => response.json())
    .then(data => {
      setModConfig(data); 
    });

  }, []);

  function handleConfigDisplay() {
    fetch(API_URL + ":" + PORT + CONFIG_ENDPOINT)
      .then(response => response.json())
      .then(data => {
        setServerConfig(data); 
      });
  };

  function fillDefaultConfig() {
    let newConfig = {};
    let configKeys = Object.keys(configOptions[algorithm]);
    let configValues = Object.values(configOptions[algorithm]);
    configKeys.forEach((key, index) => {
      newConfig[key] = configValues[index][1] ? configValues[index][1] : "";
    });
    setConfig(newConfig);
  }

  function handleAlgorithmSelect(event) {
    setAlgorithm(event.target.value);
    let newConfig = {};
    let configKeys = Object.keys(configOptions[event.target.value]);
    let configValues = Object.values(configOptions[event.target.value]);
    configKeys.forEach((key, index) => {
      newConfig[key] = configValues[index][1];
    });
    setConfig(newConfig);
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

      let configParams = modify ? modConfigOptions[algorithm] : configOptions[algorithm];
      let currConfig = modify ? modConfig : config;
      let method = modify ? "PUT" : "POST";

      let configKeys = Object.keys(configParams);
      let configValues = Object.values(configParams);
      let responseConfig = {"algorithm": algorithm};
      configKeys.forEach((key, index) => {
        switch(configValues[index][0]){
        case "FLOAT":
          responseConfig[key] = parseFloat(currConfig[key]);
          break;
        case "INT":
          responseConfig[key] = parseInt(currConfig[key]);
          break;
        case "BOOL":
          responseConfig[key] = currConfig[key] === true;
          break;
        default:
          responseConfig[key] = currConfig[key];
        }
      });
      
      fetch(API_URL + ":" + PORT + CONFIG_ENDPOINT, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify(responseConfig)
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
  

  function displayOption(key, index, alg, configValues, mod){
    let setConfigState = mod ? handleModConfigUpdate : handleConfigUpdate;
    let setCheckboxConfigState = mod ? handleModCheckboxConfigUpdate : handleCheckboxConfigUpdate;
    let configState = mod ? modConfig : config;
    switch(configValues[index][0]){
      case "FLOAT":
        return (
          <Form.Group className="mb-3" key={alg + key}>
            <Form.Label> {key} </Form.Label>
            <Form.Control type="number" 
                          step="0.000000001" 
                          value={configState[key]}
                          onChange={setConfigState(key)}
                          min={configValues[index][2]} 
                          max={configValues[index][3]} />
            <Form.Text className="text-muted">
              {configValues[index][4]}.&nbsp;
            </Form.Text>              
            {
              configValues[index][2] != null &&
              <Form.Text className="text-muted">
               Min value: {configValues[index][2]}.&nbsp;
              </Form.Text>
            }
            {
              configValues[index][3] != null &&
              <Form.Text className="text-muted">
               Max value: {configValues[index][3]}.&nbsp;
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
                          value={configState[key]}
                          onChange={setConfigState(key)}
                          min={configValues[index][2]} 
                          max={configValues[index][3]} />
            <Form.Text className="text-muted">
              {configValues[index][4]}.&nbsp;
            </Form.Text> 
            {
              configValues[index][2] != null &&
              <Form.Text className="text-muted">
               Min value: {configValues[index][2]}.&nbsp;
              </Form.Text>
            }
            {
              configValues[index][3] != null &&
              <Form.Text className="text-muted">
               Max value: {configValues[index][3]}.&nbsp;
              </Form.Text>
            }
          </Form.Group>
        )
      case "BOOL":
        return (
          <Form.Group className="mb-3" key={alg + key}>
            <Form.Check type="checkbox" 
                        label={key} 
                        checked={configState[key]}
                        onChange={setCheckboxConfigState(key)}/>
            <Form.Text className="text-muted">
              {configValues[index][4]}.&nbsp;
            </Form.Text> 
          </Form.Group>
        )
      default:
        return (
          <Form.Group className="mb-3" key={alg + key}>
            <Form.Label> {key} </Form.Label>
            <Form.Control type="text" 
                          value={configState[key]}
                          onChange={setConfigState(key)} />
            <Form.Text className="text-muted">
              {configValues[index][4]}.&nbsp;
            </Form.Text>
          </Form.Group>
        )          
    }
  }
  

  function displayConfigOptions() {
    let configParams = configOptions[algorithm];
    if(!configParams){
      return;
    }

    let configKeys = Object.keys(configParams);
    let configValues = Object.values(configParams);
    let alg = algorithm;

    return configKeys.map((key, index) => { 
      return displayOption(key, index, alg, configValues, false) 
    }); 
  }

  function displayModConfigOptions() { 
    let configParams = modConfigOptions[algorithm];
    if(!configParams){
      return;
    }
    let configKeys = Object.keys(configParams);
    let configValues = Object.values(configParams);
    let alg = algorithm;

    return configKeys.map((key, index) => { 
      return displayOption(key, index, alg, configValues, true) 
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
                    { Object.keys(configOptions).map(renderOption) }
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
