import 'bootstrap/dist/css/bootstrap.min.css';
import Head from 'next/head';
import Button from 'react-bootstrap/Button';

export default function Logs() {
  return (
    <>
      <Head>
        <title>Reinforcement learning</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Logs page</h1>
      <Button variant="primary" href="/">Back</Button>

    </>
  );
}
