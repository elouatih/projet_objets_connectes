import React, {Component} from 'react';
import {Card, Grid, Container, Dimmer, Loader, Image, Menu, Message, Icon} from "semantic-ui-react";
import MyCard from "./MyCard";
import PropreTypeSol from "./PropreTypeSol";
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
            listSoils: [],
        }
        setTimeout(() => {this.setState({loading: true})}, 1000);
    }

    componentDidMount = () => {
        socket.emit("getAllSoils", (response) => {
            this.setState({listSoils: response});
        })
    }

    handleSubmit = (idSoil) => {
        console.log(this.state.selectedPot + 1);
        console.log(idSoil);
        socket.emit("updatePotById", this.state.selectedPot + 1, -1, idSoil);
    }


    render() {
        const { activeItem } = this.state
        let count = 0;
        return (
            (
                !this.state.loading ? (
                    <Dimmer style={{ backgroundColor: "grey" , marginTop: 30, marginLeft: 15, minHeight: 400 }} active>
                        <Loader indeterminate>Preparing soils...</Loader>
                    </Dimmer>
                ) : (
                    <Container style={{ margin: 30 }}>
                        <Message attached='bottom' warning>
                            <Icon name='help' />
                            Sélectionner un pot pour redéfinir le type de sol à utiliser.
                            Chaque sol possède des caractéristiques différentes comme <b>le point de flétrissement P.F.</b> (le pourcentage
                            d'humidité au-dessous duquel la plante arrive au stress hydrique), <b>la capacité du champ</b> (le poucentage pour lequel la plante n'est
                            plus en mesure d'absorber l'air qui se trouve dans le sol).
                        </Message>
                        <Grid>
                            <Grid.Column width={5}>
                                <Container style={{ margin: 5 }}>
                                    <Card.Group itemsPerRow={this.props.listPots.length}>
                                        {
                                            this.props.listPots.map(item => (
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
                                            <br/>
                                            <br/>
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
                                            name='Choisir un type de sol pré-existant'
                                            active={activeItem === 1}
                                            onClick={() => {this.setState({activeItem: 1})}}
                                        />
                                        <Menu.Item
                                            name='Composer votre propre type de sol'
                                            active={activeItem === 2}
                                            onClick={() => {this.setState({activeItem: 2})}}
                                        />
                                    </Menu>
                                </Container>
                                <Container style={{padding: 20}}>
                                {this.state.activeItem === 1 ?
                                <Card.Group itemsPerRow={3}>
                                {
                                    this.state.listSoils.map(item => {
                                        count ++;
                                        const path = item.Image;
                                        const image = require("./assets/soils/"+path).default;
                                        return (
                                            <MyCard key={"id" + count} onClick={() => this.handleSubmit(item.Id)}>
                                                <Card.Content textAlign="center">
                                                    <Image src={image} style={{width: '60%'}}/>
                                                    <br/>
                                                    <br/>
                                                    <Card.Header>{item.Name}</Card.Header>
                                                    <Card.Meta>P.F. : <b>{Math.floor(item.PtFletrissement * 100)}%</b></Card.Meta>
                                                    <Card.Meta>C.Champ : <b>{Math.floor(item.CapaciteChamp * 100)}%</b></Card.Meta>
                                                    <Card.Meta>Eau disponible : <b> {Math.floor(item.EauDispo * 100)}% </b></Card.Meta>
                                                </Card.Content>
                                            </MyCard>
                                        )})}
                                </Card.Group>:
                                    <PropreTypeSol soils={this.state.listSoils} potId={this.state.selectedPot}/>}
                                </Container>
                            </Grid.Column>
                        </Grid>
                    </Container>
                ))
        );
    }
}

export default ConstitutionSols;