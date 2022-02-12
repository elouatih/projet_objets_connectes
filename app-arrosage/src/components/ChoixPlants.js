import React, {Component} from 'react';
import {Card, Grid, Container, Dimmer, Loader, Image, Menu} from "semantic-ui-react";
import MyCard from "./MyCard";
import socketIOClient from "socket.io-client";

const ENDPOINT = 'http://127.0.0.1:8484';
const socket = socketIOClient(ENDPOINT);

class ConstitutionSols extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeItem: 1,
            loading: false,
            selectedPot: 0,
            listPlants: []
        }
        setTimeout(() => {this.setState({loading: true})}, 500);
    }

    componentDidMount = () => {
        socket.emit("getAllPlants", (response) => {
            this.setState({listPlants: response});
        })
    }

    handleSubmit = (idPlant) => {
        socket.emit("updatePotById", this.state.selectedPot + 1, idPlant, -1);
    }


    render() {
        const { activeItem } = this.state
        let count = 0;
        return (
            (
                !this.state.loading ? (
                    <Dimmer style={{ backgroundColor: "grey" , marginTop: 30, marginLeft: 15, minHeight: 400 }} active>
                        <Loader indeterminate>Preparing plants...</Loader>
                    </Dimmer>
                ) : (
                    <Container style={{ margin: 30 }}>
                        <Grid>
                            <Grid.Column width={5}>
                                <Container style={{ margin: 5 }}>
                                    <Card.Group itemsPerRow={this.props.listPots.length}>
                                        {this.props.listPots.map(item => (
                                            <MyCard key={"id" + item.Id} onClick={() => this.setState({selectedPot: item.Id - 1})}>
                                                {item.Id}
                                            </MyCard>
                                        ))}
                                    </Card.Group>
                                    <Card key={"id" + this.props.listPots[this.state.selectedPot].Id} style={{ minHeight: 150}}>
                                        <Card.Content>
                                            <Card.Header style={{fontSize: 'large', fontWeight: 'bold'}}>Pot {this.props.listPots[this.state.selectedPot].Id}</Card.Header>
                                            <br/>
                                            <Card.Meta>Plante : {this.props.listPots[this.state.selectedPot].Plant}</Card.Meta>
                                            <Card.Meta>Sol : {this.props.listPots[this.state.selectedPot].Soil}</Card.Meta>
                                            <div className="row">
                                                <div className="col-6">
                                                    <Image src={require("./assets/soils/"+this.props.listPots[this.state.selectedPot].SoilImage).default} size='small'/>
                                                </div>
                                                <div className="col-6">
                                                    <Image src={require("./assets/plants/"+this.props.listPots[this.state.selectedPot].PlantImage).default} size='small'/>
                                                </div>
                                            </div>
                                        </Card.Content>
                                    </Card>
                                </Container>
                            </Grid.Column>
                            <Grid.Column width={11}>
                                <Container>
                                    <Menu tabular>
                                        <Menu.Item
                                            name='Choisir un type de plante pour le pot'
                                            active={activeItem === 1}
                                        />
                                    </Menu>
                                </Container>
                                <Container style={{padding: 20}}>

                                    <Card.Group itemsPerRow={4}>
                                            {
                                                this.state.listPlants.map(item => {
                                                    const path = item.Image;
                                                    const image = require("./assets/plants/"+path).default;
                                                    count ++;
                                                    return (
                                                        <MyCard key={"id" + count} onClick={() => this.handleSubmit(item.Id)}>
                                                            <Card.Content textAlign="center">
                                                                <Image src={image} size='small'/>
                                                                <br/>
                                                                <br/>
                                                                <Card.Header>{item.Name}</Card.Header>
                                                            </Card.Content>
                                                        </MyCard>
                                                    )})}
                                        </Card.Group>
                                </Container>
                            </Grid.Column>
                        </Grid>
                    </Container>
                ))
        );
    }
}

export default ConstitutionSols;