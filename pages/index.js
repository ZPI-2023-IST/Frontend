import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import Container from 'react-bootstrap/Container';
import Dropdown from 'react-bootstrap/Dropdown';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import Layout from '../components/layout'
import Port from '../components/port';
import { useState, useEffect } from "react";


export default function Home() {
  const [file, setFile] = useState(null);
  const [mode, setMode] = useState("train");
  const [run, setRun] = useState(false);
  const [show, setShow] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [time, setTime] = useState(0);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const API_URL = "http://localhost";
  const PORT = Port();
  const RUN_ENDPOINT = "/run";
  const MODEL_ENDPOINT = "/model";

  useEffect(() => {
    fetch(API_URL + ":" + PORT + RUN_ENDPOINT)
      .then(response => response.json())
      .then(data => {
        setRun(data["run"]);
        if(data["run"]){
          setTime(data["time"]);
        }
      });

    const interval = setInterval(() => {
      setTime(time => time + 1);
    }
    , 1000);
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  function handleExport() {
    // fetch model endpoint and download zip file sent from api
    fetch(API_URL + ":" + PORT + MODEL_ENDPOINT)
      .then(response => response.blob())
      .then(blob => {
        blob.lastModifiedDate = new Date();
        blob.name = "model.zip";
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = blob.name;
        a.click();
      });
  }

  function handleImport(){
    setShow(false);
    if(!file){
      return;
    }
    const formData = new FormData();
    console.log(file);
    formData.append('file', file);
    fetch(API_URL + ":" + PORT + MODEL_ENDPOINT, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/zip'
      },
      body: formData
    }).then(response => {
      if(response.status == 200){
        setShowSuccess(true);
      } else {
        setShowError(true);
        response.json().then(data => setErrorMsg(data["error"]));
      }
    });
  }

  function handleRun() {
    fetch(API_URL + ":" + PORT + RUN_ENDPOINT, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({mode: mode, run: !run})
    }).then(response => response.json())
      .then(data => {
        setRun(data["run"]);
        if(data["run"]){
          setTime(0);
        }
      });
  }

  function createRunText() {
    if (run) {
      let timeFormatted = new Date(time * 1000).toISOString().substr(11, 8);
      return "Stop (" + timeFormatted + ")";
    } else {
      return "Start " + mode.charAt(0).toUpperCase() + mode.slice(1) + "ing";
    }
  }

  return (
    <Layout>
        <Container className='mt-3' >
          <Stack gap={2} className="col-md-5 mx-auto text-center">
            <Alert variant="success" 
                   show={showSuccess} 
                   onClose={() => setShowSuccess(false)} 
                   dismissible>
              Model imported successfully!
            </Alert>
            <Alert variant="danger" 
                   show={showError} 
                   onClose={() => setShowError(false)} 
                   dismissible>
              {errorMsg}
            </Alert>
            <div>
              <h2 className="mt-3"> Run </h2>
              <p> Depending on the selected option, start the training or testing process, which will take place according to the uploaded configuration. </p>
              <Dropdown as={ButtonGroup}>
                <Button variant="primary" onClick={handleRun}>{createRunText()}</Button>

                <Dropdown.Toggle split variant="primary" id="dropdown-split-basic" />

                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setMode("train")}>Train</Dropdown.Item>
                  <Dropdown.Item onClick={() => setMode("test")}>Test</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div>
              <h2 className="mt-3">Import</h2>
              <p>Upload zip file containing the model to be imported. You will be able to change some of the parameters in configuration.</p>
              <Button variant="secondary" className="" onClick={handleShow}>Import model</Button>
            </div>

            <div>
              <h2 className="mt-3">Export</h2>
              <p>Download zip file containing the configuration and the model with learned weights.</p>
              <Button variant="secondary" onClick={handleExport}>Export model</Button>
            </div>
          </Stack>
        </Container>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Import model</Modal.Title>
          </Modal.Header>
          <Modal.Body>Upload zip containing model and configuration.</Modal.Body>
          <input id="file" type="file" onChange={handleFileChange} className='mb-4 mx-auto'/>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleImport}>
              Import
            </Button>
          </Modal.Footer>
        </Modal>
    </Layout>
  );
}
