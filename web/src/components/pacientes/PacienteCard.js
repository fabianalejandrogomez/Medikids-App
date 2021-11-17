import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import {Card, CardHeader, CardText } from 'material-ui/Card';
import { List, ListItem } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import ActionAssessment from 'material-ui/svg-icons/action/assessment';
import PersonIcon from 'material-ui/svg-icons/social/person';
import Avatar from 'material-ui/Avatar';

import PacienteDialog from './PacienteDialog';
import ConfirmDialog from '../shared/ConfirmDialog';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentCreate from 'material-ui/svg-icons/content/create';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

import PacienteRoutineReferenceList from './PacienteRoutineReferenceList';


import { CARD_WIDTH, PACIENTE_TYPES, PACIENTE_AVATAR_COLOR, INTENTS } from '../../constants';
import Divider from 'material-ui/Divider/Divider';
import { ContentContentCopy, ActionDelete, ActionHistory, ActionTrendingUp } from 'material-ui/svg-icons';

const styles = {
    deleteDialog: {
        zIndex: 2000,
    },
    container: {
        height: '100%',
    },
    cardHeader: {
        backgroundColor: PACIENTE_AVATAR_COLOR,
        marginBottom: 0,
    },
    cardTitle: {
        fontSize: '20px',
        marginTop: 6,
    },
    iconMenu: {
        position: 'absolute',
        right: 0,
        top: 10,
    },
    card: {
        width: CARD_WIDTH,
        height: '100%',
        position: 'relative',
    },
    fab: {
        margin: 0,
        top: 47,
        right: 40,
        bottom: 'auto',
        left: 'auto',
        position: 'absolute',
        zIndex: 1000,
    },
    link: {
        cursor: 'pointer',
    },
};

const initialState = {
    deleteDialog: {
        open: false,
    },
    pacienteDialog: {
        open: false,
        paciente: {},
        intent: INTENTS.EDIT,
    },
    historyDialog: {
        open: false,
    },
    progressDialog: {
        open: false,
    },
};

class PacienteCard extends Component {
    state = initialState

    handleDeleteDialogClose = (result) => {
        if (result.cancelled) {
            this.setState({ deleteDialog: { open: false }});
        }
    }

    handlePacienteDialogClose = () => {
        this.setState({
            pacienteDialog: { ...initialState.pacienteDialog },
        });
    }

    handleEditClick = () => {
        this.setState(prevState => ({
            pacienteDialog: {
                open: true,
                paciente: this.props.paciente,
                intent: INTENTS.EDIT,
            },
        }));
    }

    handleDeleteClick = () => {
        this.setState({ deleteDialog: { open: true }});
    }

    navigate = (url) => {
        this.props.history.push(url);
    }


    render() {
        let pacienteImage = this.props.paciente.genero;
        const genderStyle = {backgroundColor: this.props.paciente.genero === "Masculino" ? "#6495ED" : "#DB7093"};
        if (PACIENTE_TYPES.indexOf(pacienteImage) === -1) { 
            pacienteImage = 'unknown';
        }

        return (
            <div style={styles.container}>
                <Card zDepth={2} style={styles.card}>
                    <CardHeader                        
                        titleStyle={styles.cardTitle}
                        style={genderStyle}
                        title={
                            <span 
                                style={styles.link}
                                onClick={() => window.open(this.props.paciente.url)}
                            >
                                {this.props.paciente.name}
                            </span>
                        }
                        avatar={
                            <Avatar 
                                backgroundColor={genderStyle.backgroundColor} 
                                size={32} 
                                src={process.env.PUBLIC_URL + '/img/' + pacienteImage.toLowerCase() + '.png'} 
                            />
                        }
                    >
                        <FloatingActionButton 
                            secondary={false} 
                            zDepth={2} 
                            style={styles.fab}
                            mini={true}
                            onClick={this.handleEditClick}
                        >
                            <ContentCreate />
                        </FloatingActionButton>
                    </CardHeader>
                    <IconMenu
                            style={styles.iconMenu}
                            iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                            targetOrigin={{horizontal: 'right', vertical: 'top'}}
                    >
                        <MenuItem primaryText="Borrar" onClick={this.handleDeleteClick} leftIcon={<ActionDelete/>}/>
                    </IconMenu>
                    <CardText>
                        <List>
                            {this.props.paciente.metrics ? this.props.paciente.metrics.map(m =>                     
                                <ListItem
                                    key={m.name}
                                    leftIcon={<ActionAssessment color={'#000000'}/>}
                                    primaryText={m.name}
                                    secondaryText={m.uom ? m.uom : ''}
                                />
                            ) : ''}
                            <h3>Edad: {this.props.paciente.age}</h3>
                            <h3>Enfermedades Preexistentes: </h3>
                                <h4>
                                    <li>{this.props.paciente.enfermedadesPre01} </li>
                                    <li>{this.props.paciente.enfermedadesPre02} </li>
                                    <li>{this.props.paciente.enfermedadesPre03} </li>
                                </h4>
                            
                        </List>
                    </CardText>
                </Card>
                <ConfirmDialog 
                    title={'Borrar Paciente'}
                    buttonCaption={'Borrar'}
                    onConfirm={this.props.onDelete}
                    onClose={this.handleDeleteDialogClose}
                    open={this.state.deleteDialog.open} 
                >
                    <div>
                        <p>Estas seguro de querer borrar al paciente '{this.props.paciente.name}'?</p>
                        <PacienteRoutineReferenceList paciente={this.props.paciente}/>
                    </div>
                </ConfirmDialog>
                <PacienteDialog
                    open={this.state.pacienteDialog.open}
                    intent={this.state.pacienteDialog.intent}
                    paciente={this.state.pacienteDialog.paciente}
                    handleClose={this.handlePacienteDialogClose}
                />
            </div>
        );
    }
}

export default withRouter(PacienteCard);