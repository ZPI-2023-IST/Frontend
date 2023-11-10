import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Link from 'next/link';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Reinforcement learning</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
      <h1 className={styles.title}>
        <Link href="/configuration">Configuration</Link>
      </h1>
      <h1 className={styles.title}>
        <Link href="/logs">Logs</Link>
      </h1>
      </main>
    </div>
  );
}
