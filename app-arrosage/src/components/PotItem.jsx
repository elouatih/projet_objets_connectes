import { React, useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import { Container,  Card, Radio, Dimmer, Loader, Statistic, Image, Label, Progress, Icon, Button } from 'semantic-ui-react';

const ENDPOINT = 'http://127.0.0.1:8484';

const PotItem = (props) => {
  // State contenant les données qu'on va recevoir de la socket
  const [arduinoData, setArduinoData] = useState({
    niveauHumid: 0,
    // response: 0,
  });

  const [state, setState] = useState({
    arrosageAuto: true,
  });

  // Connexion à la socket et reception de données
  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.connect();
    socket.on('FromAPI', data => {
      setArduinoData({
        ...arduinoData,
        niveauHumid: data.pourcentage,
        response: data.response,
      });
    });
    return () => {
      socket.disconnect();
    };
  }, [arduinoData]);

  const changerModeArrosage = () => {
    // On envoie la réponse à la socket
    const socket = socketIOClient(ENDPOINT);
    socket.send('ArrosageAuto', !state.arrosageAuto);

    setState({
      ...state,
      arrosageAuto: !state.arrosageAuto,
    });

    socket.on('FromAPI', data => {
      setArduinoData({
        ...arduinoData,
        niveauHumid: data.pourcentage,
        response: data.response,
      });
    });
  };

  const LancerArrosage = () => {
    const socket = socketIOClient(ENDPOINT);
    socket.send('Arroser', true);

    socket.on('FromAPI', data => {
      setArduinoData({
        ...arduinoData,
        niveauHumid: data.pourcentage,
        response: data.response,
      });
    });
  };

  const ArreterArrosage = () => {
    const socket = socketIOClient(ENDPOINT);
    socket.send('Arroser', false);

    socket.on('FromAPI', data => {
      setArduinoData({
        ...arduinoData,
        niveauHumid: data.pourcentage,
        response: data.response,
      });
    });
  };

  const color =
      (arduinoData.niveauHumid > Math.floor(props.cc * 100) || Math.floor(props.minAbs * 100) > arduinoData.niveauHumid ) ? 'red' :
      (arduinoData.niveauHumid > Math.floor(props.minAbs * 100) && Math.floor(props.min * 100) > arduinoData.niveauHumid ) ? 'orange' :
      'green';

  const message =
      arduinoData.niveauHumid > Math.floor(props.cc * 100) ? "Zone de manque d'air" :
          Math.floor(props.minAbs * 100) > arduinoData.niveauHumid  ? "Zone de manque d'eau" :
            (arduinoData.niveauHumid > Math.floor(props.minAbs * 100) && Math.floor(props.min * 100) > arduinoData.niveauHumid ) ? "Zone de stress hydrique" :
              'Zone de confort';

  return (
      <div className="text-center">
        <Card key={"id" + props.num} style={{backgroundColor:arduinoData.response === 0 ? "#ccf3ff" : "white", minHeight: 150 }}>
          <Card.Content>
            <Card.Header style={{fontSize: 'large', fontWeight: 'bold'}}>Pot {props.num}</Card.Header>
            <br/>
            <div className="row center">
              <div className="col-7">
                <Statistic color={color}>
                    <Statistic.Value>{Math.floor(arduinoData.niveauHumid)}%</Statistic.Value>
                    <Statistic.Label>Humidité</Statistic.Label>
                </Statistic>
              </div>
              <div className="col-5">
                <Label color={color} pointing='left'>
                  {message}
                </Label>
              </div>
            </div>
            <br/>
            <div className="row center">
              <div className="col-6">
                <Label color={arduinoData.response === 0 ? "blue": "yellow"} as="a" image>
                  <div className="row center">
                    <div className="col-3">
                      <Icon color="white" size="big" name="tint"/>
                    </div>
                    <div className="col-9">
                      <Label.Detail>
                        {arduinoData.response === 0 ? "Watering activated": "Watering Stopped"}
                      </Label.Detail>
                    </div>
                  </div>
                </Label>
              </div>
              <div className="col-6">
                <Label color={state.arrosageAuto ? "green": "red"} as="a" image onClick={changerModeArrosage}>
                  {(state.arrosageAuto) ?
                        <div className="row center">
                          <div className="col-3">
                            <Icon color="white" size="big" name="sync alternate"/>
                          </div>
                          <div className="col-9">
                            <Label.Detail>
                              Automatic Mode
                            </Label.Detail>
                          </div>
                        </div>
                    :
                        <div className="row center">
                          <div className="col-3">
                          <Icon color="white" size="big" name="hand paper outline"/>
                          </div>
                          <div className="col-9">
                          <Label.Detail>
                            Manual mode"
                          </Label.Detail>
                          </div>
                        </div>}
                </Label>
              </div>
            </div>
            <br/>
            {state.arrosageAuto ? null :
                (arduinoData.response === 1) ?
                      <Button as='div' labelPosition='right' onClick={LancerArrosage}>
                        <Button icon>
                          <Icon name="play"/>
                        </Button>
                        <Label as="a" pointing="left">
                          Start watering
                        </Label>
                      </Button>
                :
                    <Button as='div' labelPosition='right' onClick={ArreterArrosage}>
                      <Button icon>
                        <Icon name="pause"/>
                      </Button>
                      <Label as="a" pointing="left">
                        Stop watering
                      </Label>
                    </Button>
            }
            <br/>
            <br/>
            <Card.Meta>Plante : {props.plant}</Card.Meta>
            <Card.Meta>Sol : {props.soil}</Card.Meta>
            <Card.Meta>Point de flétrissement : {Math.floor(props.minAbs * 100)}%</Card.Meta>
            <Card.Meta>Eau disponible : {Math.floor(props.min * 100)}%</Card.Meta>
            <Card.Meta>Capacité de champ : {Math.floor(props.cc * 100)}%</Card.Meta>
            <Card.Meta>Sol : {props.soil}</Card.Meta>
            <br/>
            <div className="row">
              <div className="col-6">
                <Image src={require("./assets/plants/"+props.plantImage).default} size='small'/>
              </div>
              <div className="col-6">
                <Image src={require("./assets/soils/"+props.soilImage).default} size='small'/>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>

  );
};

export default PotItem;
