import 'bootstrap/dist/css/bootstrap.min.css';
import Head from 'next/head';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Layout from '../components/layout'
import { useState, useEffect } from "react";
import { ChangeEvent } from "react";


export default function Home() {
  const [file, setFile] = useState(null);


  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };


  function handleExport() {
    // fetch model endpoint and download zip file sent from api
    fetch("http://localhost:5000/model")
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
    // upload zip file to api
    if(!file){
      return;
    }
    const formData = new FormData();
    console.log(file);
    formData.append('file', file);
    fetch("http://localhost:5000/model", {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/zip'
      },
      body: formData
    }).then(response => response.json())
      .then(data => {
        if(data["success"]){
          alert("Model imported successfully");
        }
      });

  }


  return (
    <Layout>
      <Head>
        <title>Reinforcement learning</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
      <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: '90vh' }}
    >
      <Row className="text-center d-flex flex-column align-items-center">
        <Col>
          <Button variant="primary" className="mb-3">Start training</Button>
        </Col>
        <Col>
          <input id="file" type="file" onChange={handleFileChange} />
          <Button variant="secondary" className="m-3" onClick={handleImport}>Import model</Button>
        </Col>
        <Col>
        <Button variant="secondary" className="m-3" onClick={handleExport}>Export model</Button>

        </Col>
      </Row>
    </Container>
      </main>
    </Layout>
  );
}
