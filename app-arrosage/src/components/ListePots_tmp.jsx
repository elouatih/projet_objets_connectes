import { Box, List, Text } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import PotItem from './PotItem';
import useWebSocket, { ReadyState } from 'react-use-websocket';

const ListePots = () => {
  const [socketUrl, setSocketUrl] = useState("wss://127.0.0.1:8484");
  const [messageHistory, setMessageHistory] = useState([]);

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl,{
    onOpen: () => console.log("Connection opened"),	
    shouldReconnect: (closeEvent) => true,
  });

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory(prev => prev.concat(lastMessage));
    }
  }, [lastMessage, setMessageHistory]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  return (
    <Box textAlign="center" padding="5">
      <List>
        <PotItem num="1" />
        <PotItem num="2" />
        <PotItem num="3" />
      </List>
      <Text>Websocket currently : {connectionStatus}</Text>
      {lastMessage ? <Text>Last message : {lastMessage.data}</Text> : <></> }
    </Box>
  );
};

export default ListePots;
