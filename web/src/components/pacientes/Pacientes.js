import React, { Component } from 'react';
import { connect } from 'react-redux';

import { fetchPacientes, deletePaciente } from './PacientesActions';
import { setTitle, showSnackbar } from '../app/AppActions';

import Spinner from '../shared/Spinner';
import PacienteCard from './PacienteCard';

import { red500 } from 'material-ui/styles/colors';
import ActionHighlightOff from 'material-ui/svg-icons/action/highlight-off';
import AddFloatingActionButton from '../shared/AddFloatingActionButton';
import PacienteDialog from './PacienteDialog';

import { CARD_WIDTH, INTENTS } from '../../constants';

const styles = {
    grid: {
        display: 'grid',
        gridGap: 10,
        gridTemplateColumns: 'repeat(auto-fit, ' + CARD_WIDTH + 'px)',
    },
    icon: {
        height: 48,
        width: 48,
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    },
};

const initialState = {
    api: {
        isExecuting: false,
        isErrored: false,
    },
};

class Pacientes extends Component {
    state = initialState;
    
    componentWillMount() {
        this.props.setTitle('Pacientes');
        
        this.setState({ api: { ...this.state.api, isExecuting: true }}, () => {
            console.log(this.props.fetchPacientes());
            this.props.fetchPacientes()
            .then(response => {
                this.setState({ api: { isExecuting: false, isErrored: false }});
            }, error => {
                this.props.showSnackbar('Error mostrando Pacientes: ' + error);
                this.setState({ api: { isExecuting: false, isErrored: true }});
            });
        });
    }

    handlePacienteDelete = (paciente) => {
        return new Promise((resolve, reject) => {
            this.props.deletePaciente(paciente._id)
            .then(response => {
                this.props.showSnackbar('Paciente Borrado \'' + paciente.name + '\'.');
                resolve(response);
            }, error => {
                this.props.showSnackbar('Error borrando Paciente \'' + paciente.name + '\': ' + error);
                reject(error);
            });
        });
    }

    render() {
        return (
            this.state.api.isExecuting ? <Spinner size={48}/> : 
                this.state.api.isErrored  ? <ActionHighlightOff style={{ ...styles.icon, color: red500 }} /> :
                    <div>
                        <div style={styles.grid}>
                            {console.log(this.props)}
                            {
                            this.props.pacientes.map(e =>  
                                <PacienteCard 
                                    key={e._id}
                                    paciente={e} 
                                    onDelete={() => this.handlePacienteDelete(e)}
                                />
                            )}
                        </div>
                        <AddFloatingActionButton 
                            startOpen={!this.props.pacientes.length}
                            dialog={<PacienteDialog intent={INTENTS.ADD} />} 
                        />
                    </div>
        );
    }
} 

const mapStateToProps = (state) => ({
    pacientes: state.pacientes,
});

const mapDispatchToProps = {
    fetchPacientes,
    deletePaciente,
    showSnackbar,
    setTitle,
};

export default connect(mapStateToProps, mapDispatchToProps)(Pacientes);