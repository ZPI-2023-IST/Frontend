import Link from 'next/link';
import Head from 'next/head';

export default function Logs() {
  return (
    <>
      <Head>
        <title>Reinforcement learning</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Logs page</h1>
      <h2>
        <Link href="/">Back to home</Link>
      </h2>
    </>
  );
}
