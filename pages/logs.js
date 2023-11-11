import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Head from 'next/head';
import Layout from '../components/layout';
import { useEffect, useState } from 'react';

export default function Logs() {
  let mock_text = '{"logs": [{"content": "There has been an error",  "type": "config", "level": "debug"},' +
    '{"content": "Moved Ks to As",  "type": "test", "level": "info"},' +
    '{"content": "There has been an error",  "type": "config", "level": "warning"},' +
    '{"content": "Game is over. You won.",  "type": "test", "level": "error"},' +
    '{"content": "It\'s 50th move. There are 13 cards on the board.",  "type": "train", "level": "fatal"}]}';
  
  const mock_json = JSON.parse(mock_text);
  console.log(mock_json);

  const [filter, setFilter] = useState(['config', 'train', 'test']);
  const [filterLevel, setFilterLevel] = useState(['debug', 'info', 'warning', 'error', 'fatal']);
  const [logs, _] = useState(mock_json.logs);
  
  logs.forEach((log) => {{
    console.log(log.type)
    console.log(filter.includes(log.type))
  }});
  const filteredLogs = logs.filter(log => filter.includes(log.type) && filterLevel.includes(log.level));

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

  return (
    <Layout>
      <Head>
        <title>Reinforcement learning</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Logs page</h1>


      <div style={{display: 'flex', width: '80vw', marginInline: 'auto', marginBottom: '0.2em'}}>
        <div className="window" style={{display: 'flex', marginLeft: '2em', gap:'0.2em'}}>
          <Button variant='dark' className={filter.includes('config') ? "" : "opacity-50"} onClick={() => handleFilterChangeType('config')}>Config</Button>{' '}
          <Button variant='dark' className={filter.includes('test') ? "" : "opacity-50"} onClick={() => handleFilterChangeType('test')}>Test</Button>{' '}
          <Button variant='dark' className={filter.includes('train') ? "" : "opacity-50"} onClick={() => handleFilterChangeType('train')}>Train</Button>{' '}
        </div>
        <div className="window" style={{display: 'flex', marginLeft: 'auto', gap:'0.2em', marginRight: '2em'}}>
          <Button className={filterLevel.includes('debug') ? "" : "opacity-50"} onClick={() => handleFilterChangeLevel('debug')}>Debug</Button>{' '}
          <Button variant='success' className={filterLevel.includes('info') ? "" : "opacity-50"}onClick={() => handleFilterChangeLevel('info')}>Info</Button>{' '}
          <Button variant='warning' className={filterLevel.includes('warning') ? "" : "opacity-50"}onClick={() => handleFilterChangeLevel('warning')}>Warning</Button>{' '}
          <Button variant='danger' className={filterLevel.includes('error') ? "" : "opacity-50"}onClick={() => handleFilterChangeLevel('error')}>Error</Button>{' '}
          <Button variant='secondary' className={filterLevel.includes('fatal') ? "" : "opacity-50"}onClick={() => handleFilterChangeLevel('fatal')}>Fatal</Button>{' '}
        </div>
      </div>
      
      <div className="window" style={{ width: '80vw', maxHeight: '70vh', margin: 'auto', overflowY: 'scroll', display: 'flex', flexDirection: 'column', gap: '0.15em'}}>
        {filteredLogs.map((log, index) => (
          <Card
            bg={log.level === 'error' ? 'danger' : log.level === 'warning' ? 'warning' : log.level === 'info' ? 'success' : log.level === 'fatal' ? 'secondary' : 'primary'}
            border="dark"
            text={log.level === 'warning' ? 'dark' : 'white'}
            key={index}
            classname="mb-2"
          >
            <Card.Header>{log.type + ', level: ' +log.level}</Card.Header>
            <Card.Body>{log.content}</Card.Body>
          </Card>
        ))}
      </div>
    </Layout>
  );
}