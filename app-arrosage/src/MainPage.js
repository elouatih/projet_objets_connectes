import React, {Component} from 'react';
import socketIOClient from 'socket.io-client';
import {Grid, Menu, Segment, Visibility, Container, Button, Header, Icon} from 'semantic-ui-react';
import ConstitutionSols from "./components/ConstitutionSols";
import ChoixPlants from "./components/ChoixPlants";
import ListePots from "./components/ListePots";

const ENDPOINT = 'http://127.0.0.1:8484';
const socket = socketIOClient(ENDPOINT);

class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItem: 1,
            listPots: [],
            imagesPlants: [],
            imagesSoils: []
        }
        setInterval( () => {
            socket.emit("getAllPots", (response) => {
                this.setState({listPots: response});

        })}, 500);
    }

    handleItemClick = (e, { id }) => this.setState({ activeItem: id })

    componentDidMount = () => {
        socket.emit("getAllPots", (response) => {
            this.setState({listPots: response});
        })

        /*socket.emit("getImagesSoils", (response) => {
            this.setState({imagesSoils: response})
        })

        socket.emit("getImagesPlants", (response) => {
            this.setState({imagesPlants: response})
        })*/
    }

    render() {
        const { activeItem } = this.state

        return (
            <Grid>
                <Visibility once={false}>
                    <Segment textAlign='center' style={{weight: '100%', minHeight: 700, padding: '3em' }} vertical>
                        <Menu size='massive'>
                            <Container>
                                <Menu.Item as='a' active>Home</Menu.Item>
                                <Menu.Item as='a'>Sols</Menu.Item>
                                <Menu.Item as='a'>Plantes</Menu.Item>
                                <Menu.Item position='right'>
                                    <Button as='a'>
                                        Reset pots
                                    </Button>
                                </Menu.Item>
                            </Container>
                        </Menu>
                        <Grid>
                            <Grid.Column width={4}>
                                <Menu tabular='left' fluid vertical size='massive'>
                                    <Menu.Item
                                        icon='users'
                                        name='Mes pots'
                                        id={1}
                                        active={activeItem === 1}
                                        onClick={this.handleItemClick}/>
                                    <Menu.Item
                                        icon='chess rook'
                                        name='Constitution des sols'
                                        id={2}
                                        active={activeItem === 2}
                                        onClick={this.handleItemClick}/>
                                    <Menu.Item
                                        icon='envira gallery'
                                        name='Choix des plantes'
                                        id={3}
                                        active={activeItem === 3}
                                        onClick={this.handleItemClick}/>
                                    <Menu.Item
                                        icon='chart pie'
                                        name='Mes graphiques'
                                        id={4}
                                        active={activeItem === 4}
                                        onClick={this.handleItemClick}/>
                                    <Menu.Item
                                        icon='settings'
                                        name='Configuration'
                                        id={5}
                                        active={activeItem === 5}
                                        onClick={this.handleItemClick}/>
                                </Menu>
                            </Grid.Column>
                            <Grid.Column width={12}>
                                {this.state.activeItem === 1 ? <ListePots listPots={this.state.listPots} /> :
                                    this.state.activeItem === 2 ? <ConstitutionSols listPots={this.state.listPots} /> :
                                    this.state.activeItem === 3 ? <ChoixPlants listPots={this.state.listPots}/> :
                                        <Segment placeholder>
                                            <Header icon>
                                                <Icon name='pdf file outline' />
                                                Currently unavailable
                                            </Header>
                                        </Segment>
                                }
                            </Grid.Column >
                        </Grid>
                    </Segment>
                </Visibility>
            </Grid>
        )
    }
}

export default MainPage;