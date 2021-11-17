import React, { Component } from 'react';

import ActionHistory from 'material-ui/svg-icons/action/history';
import Avatar from 'material-ui/Avatar';
import { black } from 'material-ui/styles/colors';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import TextField from 'material-ui/TextField';
import { grey300 } from 'material-ui/styles/colors';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import ActionTrendingUp from 'material-ui/svg-icons/action/trending-up';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import Spinner from '../shared/Spinner';

import { CARD_WIDTH, PACIENTE_TYPES, PACIENTE_AVATAR_COLOR } from '../../constants';
import { getElapsedTime } from '../../util';

import PacienteHistoryDialog from './history/PacienteHistoryDialog';
import PacienteProgressDialog from './history/PacienteProgressDialog';
import { AvPlayArrow, AvStop, AvFastRewind, AvReplay } from 'material-ui/svg-icons';
import Divider from 'material-ui/Divider/Divider';
import ConfirmDialog from '../shared/ConfirmDialog';

const styles = {
    cardHeader: {
        backgroundColor: PACIENTE_AVATAR_COLOR,
        marginBottom: 0,
    },
    cardTitle: {
        fontSize: '20px',
    },
    card: {
        width: CARD_WIDTH - 100,
        height: '100%',
        marginBottom: 5,
        marginLeft: 5,
        marginTop: 20,
    },
    fab: {
        margin: 0,
        top: 67,
        left: 210,
        position: 'absolute',
        zIndex: 100,
    },
    link: {
        cursor: 'pointer',
    },
    button: {
        float: 'right',
    },
    time: {
        color: black,
    },
    iconMenu: {
        position: 'relative',
        right: -240,
        top: -58,
    },
    text: {
        marginTop: -48,
    },
};

const initialState = {
    ticker: 0,
    paciente: undefined,
    api: {
        isExecuting: false,
        isErrored: false,
    },
    historyDialog: {
        open: false,
    },
    progressDialog: {
        open: false,
    },
    resetDialog: {
        open: false,
    },
};

class PacienteForm extends Component {
    state = { ...initialState, paciente: this.props.paciente };

    timer;

    handleHistoryClick = () => { 
        this.setState({ historyDialog: { open: true }});
    }

    handleHistoryClose = () => {
        this.setState({ historyDialog: { open: false }});
    }

    handleProgressClick = () => { 
        this.setState({ progressDialog: { open: true }});
    }

    handleProgressClose = () => {
        this.setState({ progressDialog: { open: false }});
    }

    handleMetricChange = (event, value, metric) => {
        this.setState({ 
            paciente: { 
                ...this.state.paciente,
                metrics: this.state.paciente.metrics.map(m => {
                    return m.name === metric.name ? { ...metric, value: value } : m;
                }),
            },
        });
    }

    handleResetClick = () => {
        this.setState({ resetDialog: { open: true }});
    }

    handleResetConfirm = () => {
        let e = { ...this.state.paciente };

        delete e.startTime;
        delete e.endTime;
        delete e.notes;

        e.metrics.forEach(m => {
            delete m.value;
        });

        return this.updatePaciente(e, true);
    }

    handleResetClose = (result) => {
        this.setState({ resetDialog: { open: false }});
    }

    handleNotesChange = (event, value) => {
        this.setState({ paciente: { ...this.state.paciente, notes: value }});
    }

    handleActionClick = () => {
        if (!this.props.paciente.startTime) {
            this.updatePaciente({ ...this.state.paciente, startTime: new Date().getTime() });
        }
        else if (!this.props.paciente.endTime) {
            this.updatePaciente({ ...this.state.paciente, endTime: Date.now() });
        }
        else {
            this.updatePaciente({ ...this.props.paciente, startTime: new Date().getTime(), endTime: undefined });
        }
    }

    updatePaciente = (paciente, suppressApi = false) => {
        return new Promise((resolve, reject) => {
            this.setState({ 
                api: !suppressApi ? { ...this.state.api, isExecuting: true } : this.state.api,
            }, () =>
                this.props.onChange(paciente)
                .then(() => {
                    this.setState({ api: { ...this.state.api, isExecuting: false }}, () => resolve());
                }, error => {
                    this.setState({ api: { isExecuting: false, isErrored: true }}, () => reject());
                })
            );
        });
    }

    getMetricDisplayName = (metric) => {
        return metric.name + (metric.uom ? ' (' + metric.uom + ')' : '');
    }

    componentDidMount = () => {
        this.timer = setInterval(() => this.setState({ ticker: this.state.ticker + 1 }), 1000);
    }

    componentWillUnmount = () => {
        clearInterval(this.timer);
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.state.paciente.startTime !== nextProps.paciente.startTime || this.state.paciente.endTime !== nextProps.paciente.endTime) {
            this.setState({ paciente: nextProps.paciente });
        }
    }

    render() {
        let pacienteImage = this.props.paciente.type;
        if (PACIENTE_TYPES.indexOf(pacienteImage) === -1) { 
            pacienteImage = 'unknown';
        }

        let started = this.props.paciente.startTime;

        return (
            <div>
                <Card 
                    zDepth={2} 
                    style={!this.state.api.isExecuting ? styles.card : 
                        { 
                            ...styles.card, 
                            backgroundColor: grey300, 
                        }
                    }
                >
                    <CardHeader                        
                        titleStyle={{ ...styles.cardTitle, marginTop: started ? 0 : 6 }}
                        style={styles.cardHeader}
                        title={
                            <span 
                                style={styles.link}
                                onClick={() => window.open(this.props.paciente.url)}
                            >
                                {this.props.paciente.name}
                            </span>
                        }
                        subtitle={started ? 'Elapsed time ' + getElapsedTime(this.props.paciente.startTime, this.props.paciente.endTime) : undefined}
                        avatar={
                            <Avatar 
                                style={{marginTop: started ? 4 : 0}}
                                backgroundColor={PACIENTE_AVATAR_COLOR} 
                                size={32} 
                                src={process.env.PUBLIC_URL + '/img/' + pacienteImage.toLowerCase() + '.png'} 
                            />
                        }
                    >
                    </CardHeader>
                    <FloatingActionButton 
                        secondary={false} 
                        zDepth={2} 
                        style={{ ...styles.fab, top: started ? styles.fab.top + 5 : styles.fab.top }}
                        mini={true}
                        onClick={this.handleActionClick}
                    >
                        {!started ? <AvPlayArrow/> :
                            !this.props.paciente.endTime ? <AvStop/> : <AvFastRewind/>
                        }
                    </FloatingActionButton>
                    <IconMenu
                        style={{ ...styles.iconMenu, top: started ? styles.iconMenu.top - 5 : styles.iconMenu.top }}
                        iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                        targetOrigin={{horizontal: 'right', vertical: 'top'}}
                    >
                        <MenuItem primaryText="Resetear" onClick={this.handleResetClick} leftIcon={<AvReplay/>}/>                      
                    </IconMenu>
                    <CardText style={styles.text}>
                        {this.state.paciente.metrics ? 
                            this.state.paciente.metrics.map((m, index) =>    
                                <TextField
                                    key={index}
                                    hintText={this.getMetricDisplayName(m)}
                                    floatingLabelText={this.getMetricDisplayName(m)}
                                    onChange={(e,v) => this.handleMetricChange(e,v,m)}
                                    value={m.value ? m.value : ''}
                                    disabled={this.state.paciente.endTime !== undefined || this.state.paciente.startTime === undefined}
                                />
                            ) : ''
                        }
                    </CardText>
                    <TextField
                            hintText={'Notas'}
                            floatingLabelText={'Notas'}
                            multiLine={true}
                            onChange={this.handleNotesChange}
                            value={this.state.paciente.notes ? this.state.paciente.notes : ''}
                            disabled={this.state.paciente.endTime !== undefined || this.state.paciente.startTime === undefined}
                        />
                    {this.state.api.isExecuting ? <Spinner/> : ''}
                </Card>
                <PacienteHistoryDialog
                    open={this.state.historyDialog.open}
                    onClose={this.handleHistoryClose}
                    paciente={this.state.paciente}
                />
                <PacienteProgressDialog
                    open={this.state.progressDialog.open}
                    onClose={this.handleProgressClose}
                    paciente={this.state.paciente}
                />
                <ConfirmDialog 
                    title={'Resetear Medicion'}
                    buttonCaption={'Resetear'}
                    onConfirm={this.handleResetConfirm}
                    onClose={this.handleResetClose}
                    open={this.state.resetDialog.open} 
                >
                    Estas seguro que queres resetar una Medicion? '{this.state.paciente.name}'?
                </ConfirmDialog>
            </div>
        );
    }
}

export default PacienteForm;