import Navbar from './navbar'
import Head from 'next/head'

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <Head>
        <title>Reinforcement learning</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>{children}</main>
    </>
  )
}
