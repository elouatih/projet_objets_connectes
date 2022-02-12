import React, {Component} from 'react';
import {Card, Button, Icon, Image, Statistic} from "semantic-ui-react";
import socketIOClient from "socket.io-client";

const ENDPOINT = 'http://127.0.0.1:8484';
const socket = socketIOClient(ENDPOINT);

class PropreTypeSol extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sableProportion: 0,
            limonProportion: 0,
            argileProportion: 0,
            plantName: "Fraisier",
            soilName: "Argile",
            idSoil: 0,
            soilImage: "argile.png",
            typesSoils: [
                {Name: "Argile", Composition: [
                        {A: [60, 100], S: [0, 40], L: [0, 40]},
                        {A: [55, 60], S: [0, 45], L: [0, 40]},
                        {A: [40, 55], S: [5, 45], L: [0, 40]}]},
                {Name: "Argile sableuse", Composition: [
                        {A: [35, 55], S: [45, 65], L: [0, 20]},
                        {A: [40, 60], S: [0, 20], L: [40, 60]}]},
                {Name: "Limon argilo-sableux", Composition: [
                        {A: [20, 35], S: [45, 80], L: [0, 20]},
                        {A: [27, 35], S: [45, 53], L: [20, 27]},
                        {A: [20, 27], S: [45, 60], L: [20, 27]}]},
                {Name: "Limon sableux", Composition: [
                        {A: [0, 20], S: [53, 80], L: [0, 47]},
                        {A: [0, 7], S: [50, 53], L: [40, 50]},
                        {A: [0, 7], S: [43, 50], L: [43, 50]}]},
                {Name: "Sable limoneux", Composition: [
                        {A: [0, 20], S: [80, 90], L: [0, 20]}]},
                {Name: "Sable", Composition: [
                        {A: [0, 10], S: [90, 100], L: [0, 10]}]},
                {Name: "Limon tres fin", Composition: [
                        {A: [0, 13], S: [0, 20], L: [80, 100]}]},
                {Name: "Limon fin", Composition: [
                        {A: [0, 27], S: [0, 50], L: [50, 80]},
                        {A: [13, 20], S: [0, 7], L: [80, 87]}]},
                {Name: "Limon argileux fin", Composition: [
                        {A: [27, 40], S: [0, 20], L: [40, 73]}]},
                {Name: "Limon argileux", Composition: [
                        {A: [27, 40], S: [20, 45], L: [15, 53]}]},
                {Name: "Limon", Composition: [
                        {A: [], S: [], L: []}]}
            ]
        }
    }

    checkElementInArray = (element, array) => {
        return element <= array[1] && element >= array[0]
    }

    handleSubmitPot = () => {
        socket.emit("updatePotById", this.props.potId + 1, -1, this.state.idSoil);
    }

    handleSubmit = () => {
        let bool = false;
        for (let i=0; i < this.state.typesSoils.length; i++){
            for(let j=0; j<this.state.typesSoils[i].Composition.length; j++){
                if(this.checkElementInArray(this.state.argileProportion, this.state.typesSoils[i].Composition[j].A) &&
                   this.checkElementInArray(this.state.sableProportion, this.state.typesSoils[i].Composition[j].S) &&
                   this.checkElementInArray(this.state.limonProportion, this.state.typesSoils[i].Composition[j].L)){
                    this.setState({soilName: this.state.typesSoils[i].Name});
                    bool = true;
                    break;
                }
            }
        }
        if(!bool) this.setState({soilName: "Limon"});
        console.log(this.props.soils);
        let image = "";
        let count = 0;
        setTimeout(() => {
            for(let i=0; i<this.props.soils.length; i++){
                console.log(this.state.soilName);
                if(this.props.soils[i].Name === this.state.soilName){
                    console.log("true");
                    image = this.props.soils[i].Image;
                    count = this.props.soils[i].Id;
                    break;
                    //this.setState({soilImage: this.props.soils[i].Image})
                }
            }
            this.setState({soilImage: image, idSoil: count})
            setTimeout(() => console.log(this.state.soilImage), 100)
        }, 500);

        /*setTimeout(() => {
            console.log("soil name : ", this.state.soilName);
            socket.emit("updatePot", this.props.potId, this.state.plantName, this.state.soilName);
        }, 1000);*/
    }

    handleChange = (event) => {
        if(event.target.id === "0"){
            this.setState({
                argileProportion: parseInt(event.target.value),
                sableProportion: 100 - parseInt(event.target.value)

            });
        } else if(event.target.id === "1"){
            this.setState({
                sableProportion: parseInt(event.target.value),
            });
        }
        if(100 - this.state.argileProportion - this.state.sableProportion >= 0){
            this.setState({
                limonProportion: 100 - this.state.argileProportion - this.state.sableProportion
            })
        }
    }


    render() {
        const path = this.state.soilImage;
        const image = require("./assets/soils/"+path).default;
        return (
            //<div style={{familyFont: "Latin Modern Sans"}}>
            <div className="row">
                <div className="col-7">
                    <Card centered>
                        <Card.Content>
                            <Card.Header as="h2">Composer votre propre sol</Card.Header>
                            <Card.Meta>Choisissez les pourcentages des éléments basiques constituant le sol</Card.Meta>
                            <Card.Description>
                                <div>
                                    <label htmlFor="argileProportion">Argile : {this.state.argileProportion}%</label>
                                    <br/>
                                    <input type="range" id="0" name="argileProportion"
                                           min="0" max="100" value={this.state.argileProportion} onChange={this.handleChange}/>
                                </div>
                                <div>
                                    <label htmlFor="sableProportion">Sable : {this.state.sableProportion}%</label>
                                    <br/>
                                    <input type="range" id="1" name="sableProportion"
                                           min="0" max="100" value={this.state.sableProportion} onChange={this.handleChange}/>
                                </div>
                                <div>
                                    <label htmlFor="limonProportion">Limon : {this.state.limonProportion}%</label>
                                    <br/>
                                    <input type="range" id="2" name="limonProportion"
                                           min="0" max="100" value={this.state.limonProportion} onChange={() => console.log("rien")}/>
                                </div>
                                <br/>
                                <Button animated onClick={this.handleSubmit}>
                                    <Button.Content visible>Composer le sol</Button.Content>
                                    <Button.Content hidden>
                                        <Icon name='dashboard' />
                                    </Button.Content>
                                </Button>
                            </Card.Description>
                        </Card.Content>
                    </Card>

                </div>
                <div className="col-5">
                    <Card>
                        <Card.Content>
                            <Card.Header>
                                Estimation du sol
                            </Card.Header>
                            <br/>
                            <Image src={image} size='tiny'/>
                            <br/>
                            <br/>
                            <Card.Description>
                                <Statistic>
                                    <Statistic.Value text>
                                        {this.state.soilName}
                                    </Statistic.Value>
                                </Statistic>
                                <Button animated onClick={this.handleSubmitPot}>
                                    <Button.Content visible>Appliquer le sol</Button.Content>
                                    <Button.Content hidden>
                                        <Icon name='hand point down outline' />
                                    </Button.Content>
                                </Button>
                            </Card.Description>
                        </Card.Content>
                    </Card>
                </div>

            </div>
        );
    }
}

export default PropreTypeSol;