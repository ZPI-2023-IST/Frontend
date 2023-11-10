import 'bootstrap/dist/css/bootstrap.min.css';
import Head from 'next/head';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';

import Layout from '../components/layout';


export default function Configuration() {
  const [algorithm, setAlgorithm] = React.useState(0);


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
            <Form.Label>Algorithm</Form.Label>
            <Form.Select aria-label="Default select example">
              <option>Open this select menu</option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formMode">
            <Form.Label>Mode</Form.Label>
            <Form.Select aria-label="Default select example">
              <option>Open this select menu</option>
              <option value="train">Train</option>
              <option value="test">Test</option>
            </Form.Select>
          </Form.Group>
        </Stack>
      </Container>
    </Layout>
  );
}
