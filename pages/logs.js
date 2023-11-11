import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Head from 'next/head';
import Layout from '../components/layout';
import { useEffect, useState } from 'react';

const URL = "http://127.0.0.1:5000/logs";

export default function Logs() {
  // let mock_text = '{"logs": message:[{"content": "There has been an error",  "type": "CONFIG", "level": "DEBUG"},' +
  //   '{"content": "Moved Ks to As",  "type": "TEST", "level": "INFO"},' +
  //   '{"content": "There has been an error",  "type": "CONFIG", "level": "WARNING"},' +
  //   '{"content": "Game is over. You won.",  "type": "TEST", "level": "ERROR"},' +
  //   '{"content": "It\'s 50th move. There are 13 cards on the board.",  "type": "TRAIN", "level": "FATAL"}]}';
  
  // const mock_json = JSON.parse(mock_text);

  const [filter, setFilter] = useState(['CONFIG', 'TRAIN', 'TEST']);
  const [filterLevel, setFilterLevel] = useState(['DEBUG', 'INFO', 'WARNING', 'ERROR', 'FATAL']);
  const [logs, setLogs] = useState([]);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    fetch(URL)
      .then(response => response.json())
      .then(data => {
        setLogs(data.logs)
        setFetched(true);
      })
  }, []);
  
  const filteredLogs = logs.filter(log => filter.includes(log.message.type) && filterLevel.includes(log.message.level));

  const handleFilterChangeType = (newFilter) => {
    if(filter.includes(newFilter)){
      setFilter(filter.filter(item => item !== newFilter));
    }
    else{
      setFilter([...filter, newFilter]);
    }
  };

  const handleFilterChangeLevel = (newFilter) => {
    if(filterLevel.includes(newFilter)){
      setFilterLevel(filterLevel.filter(item => item !== newFilter));
    }
    else{
      setFilterLevel([...filterLevel, newFilter]);
    }
  };

  return fetched?(
    <Layout>
      <Head>
        <title>Reinforcement learning</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Logs page</h1>


      <div style={{display: 'flex', width: '80vw', marginInline: 'auto', marginBottom: '0.2em'}}>
        <div className="window" style={{display: 'flex', marginLeft: '2em', gap:'0.2em'}}>
          <Button variant='dark' className={filter.includes('CONFIG') ? "" : "opacity-50"} onClick={() => handleFilterChangeType('CONFIG')}>Config</Button>{' '}
          <Button variant='dark' className={filter.includes('TEST') ? "" : "opacity-50"} onClick={() => handleFilterChangeType('TEST')}>Test</Button>{' '}
          <Button variant='dark' className={filter.includes('TRAIN') ? "" : "opacity-50"} onClick={() => handleFilterChangeType('TRAIN')}>Train</Button>{' '}
        </div>
        <div className="window" style={{display: 'flex', marginLeft: 'auto', gap:'0.2em', marginRight: '2em'}}>
          <Button className={filterLevel.includes('DEBUG') ? "" : "opacity-50"} onClick={() => handleFilterChangeLevel('DEBUG')}>Debug</Button>{' '}
          <Button variant='success' className={filterLevel.includes('INFO') ? "" : "opacity-50"}onClick={() => handleFilterChangeLevel('INFO')}>Info</Button>{' '}
          <Button variant='warning' className={filterLevel.includes('WARNING') ? "" : "opacity-50"}onClick={() => handleFilterChangeLevel('WARNING')}>Warning</Button>{' '}
          <Button variant='danger' className={filterLevel.includes('ERROR') ? "" : "opacity-50"}onClick={() => handleFilterChangeLevel('ERROR')}>Error</Button>{' '}
          <Button variant='secondary' className={filterLevel.includes('FATAL') ? "" : "opacity-50"}onClick={() => handleFilterChangeLevel('FATAL')}>Fatal</Button>{' '}
        </div>
      </div>
      
      <div className="window" style={{ width: '80vw', maxHeight: '70vh', margin: 'auto', overflowY: 'scroll', display: 'flex', flexDirection: 'column', gap: '0.15em'}}>
        {filteredLogs.map((log, index) => (
          <Card
            bg={log.message.level === 'ERROR' ? 'danger' : log.message.level === 'WARNING' ? 'warning' : log.message.level === 'INFO' ? 'success' : log.message.level === 'FATAL' ? 'secondary' : 'primary'}
            border="dark"
            text={log.message.level === 'WARNING' ? 'dark' : 'white'}
            key={index}
            className="mb-2"
          >
            <Card.Header>{'type: '+log.message.type + ', level: ' +log.message.level}</Card.Header>
            <Card.Body>{log.message.content}</Card.Body>
          </Card>
        ))}
      </div>
    </Layout>
  ):<div>essa</div>;
}