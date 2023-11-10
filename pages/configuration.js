import 'bootstrap/dist/css/bootstrap.min.css';
import Head from 'next/head';
import Button from 'react-bootstrap/Button';
import Layout from '../components/layout';

export default function Configuration() {
  return (
    <Layout>
      <Head>
        <title>Reinforcement learning</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Config page</h1>

    </Layout>
  );
}
