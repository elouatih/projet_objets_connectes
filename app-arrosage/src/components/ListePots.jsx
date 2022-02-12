import React from 'react';
import {Container, Card} from "semantic-ui-react";
import PotItem from "./PotItem";

const ListePots = (props) => {

  return (
      <Container style={{ margin: 30 }}>
        <Card.Group itemsPerRow={3}>
          {props.listPots.map(item => <PotItem num={item.Id}
                                               humidity={item.Humidity}
                                               soilImage={item.SoilImage}
                                               plantImage={item.PlantImage}
                                               soil={item.Soil}
                                               plant={item.Plant}
                                               minAbs={item.MinAbs}
                                               cc={item.CC} min={item.Min}
          />)}
        </Card.Group>
      </Container>
  );
};

export default ListePots;
