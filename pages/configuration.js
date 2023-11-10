import Link from 'next/link';
import Head from 'next/head';

export default function Configuration() {
  return (
    <>
      <Head>
        <title>Reinforcement learning</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Config page</h1>
      <h2>
        <Link href="/">Back to home</Link>
      </h2>
    </>
  );
}
