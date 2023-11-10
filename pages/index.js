import 'bootstrap/dist/css/bootstrap.min.css';
import Head from 'next/head';
import Button from 'react-bootstrap/Button';


export default function Home() {
  return (
    <div>
      <Head>
        <title>Reinforcement learning</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
      <Button variant="primary" href="/configuration">Configuration</Button>
      <Button variant="primary" href="/logs">Logs</Button>
      </main>
    </div>
  );
}
