import React, { Component } from 'react';
import { connect } from 'react-redux';

import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { addPaciente, updatePaciente } from './PacientesActions';
import { showSnackbar } from '../app/AppActions.js';
import { grey300 } from 'material-ui/styles/colors';

import Spinner from '../shared/Spinner';

import { PACIENTE_TYPES, INTENTS } from '../../constants';
import { getGuid, swapArrayElements, validateUrl } from '../../util';

import SaveRetryFlatButton from '../shared/SaveRetryFlatButton';

const styles = {
    name: {
        width: '100%',
    },
    type: {
        width: '100%',
    },
    url: {
        width: '100%',
    },
    dialogContent: {
        width: 400,
    },
    addMetric: {
        float: 'left',
    },
};

const initialState = {
    paciente: {
        id: getGuid(),
        name: '',
        type: '',
        url: '',
        metrics: [],
    },
    metricDialog: {
        open: false,
        intent: '',
        metric: {},
    },
    validationErrors: {
        name: '',
        type: '',
        url: '',
    },
    api: {
        isExecuting: false,
        isErrored: false,
    },
};

class PacienteDialog extends Component {
    state = initialState

    handleNameChange = (event, value) => {
        let nameList = this.props.existingNames;

        if (this.props.intent === INTENTS.EDIT) {
            nameList = nameList.filter(n => n.toLowerCase() !== this.props.paciente.name.toLowerCase());
        }

        if (nameList.find(n => n.toLowerCase() === value.toLowerCase())) {
            this.setState(prevState => ({
                validationErrors: { ...prevState.validationErrors, name: 'Este nombre ya esta en uso.' }, 
            }));
        }
        else {
            this.setState(prevState => ({
                paciente: { ...prevState.paciente, name: value },
                validationErrors: {  ...prevState.validationErrors, name: '' },
            }));
        }
    }

    handleTypeChange = (event, index, value) => {
        this.setState(prevState => ({ 
            paciente: { ...prevState.paciente, genero: value },
            validationErrors: { ...prevState.validationErrors, genero: '' },
        }));
    }

    handleAgeChange = (event, value) => {
        this.setState(prevState => ({
            paciente: { ...prevState.paciente, age: value },
            validationErrors: { ...prevState.validationErrors, age: '' },
        }));
    }

    handleEnf1 = (event, value) => {
        this.setState(prevState => ({
            paciente: { ...prevState.paciente, enfermedadesPre01: value },
            validationErrors: { ...prevState.validationErrors, enfermedadesPre01: '' },
        }));
    }
    handleEnf2 = (event, value) => {
        this.setState(prevState => ({
            paciente: { ...prevState.paciente, enfermedadesPre02: value },
            validationErrors: { ...prevState.validationErrors, enfermedadesPre02: '' },
        }));
    }
    handleEnf3 = (event, value) => {
        this.setState(prevState => ({
            paciente: { ...prevState.paciente, enfermedadesPre03: value },
            validationErrors: { ...prevState.validationErrors, enfermedadesPre03: '' },
        }));
    }




    handleSaveClick = () => {
        this.setState({
            validationErrors: { 
                name: this.state.paciente.name === '' ? 'El Paciente Debe Tener un Nombre.' : '',
                type: this.state.paciente.type === '' ? 'Un genero debe ser seleccionado.' : '',
            },
        }, () => {
            if (Object.keys(this.state.validationErrors).find(e => this.state.validationErrors[e] !== '') === undefined) {
                this.setState({ api: { ...this.state.api, isExecuting: true } });

                if (this.props.intent === INTENTS.EDIT) {
                    this.props.updatePaciente(this.state.paciente)
                    .then((response) => {
                        this.handleApiSuccess('Paciente Actualizado \'' + response.data.name + '\'.');
                    }, (error) => {
                        this.handleApiError('Error Actualizando Paciente \'' + this.state.paciente.name + '\': ' + error);
                    });
                }
                else {
                    this.props.addPaciente(this.state.paciente)
                    .then((response) => {
                        this.handleApiSuccess('Paciente Agregado \'' + response.data.name + '\'.');
                    }, (error) => {
                        this.handleApiError('Error Agregando Paciente \'' + this.state.paciente.name + '\': ' + error);
                    });
                }
            }
        });
    }

    handleApiSuccess = (message) => {
        this.setState({ ...this.state.api, isExecuting: false });
        this.props.showSnackbar(message);
        this.props.handleClose();
    }

    handleApiError = (message) => {
        this.setState({ api: { isExecuting: false, isErrored: true }});
        this.props.showSnackbar(message);
    }

    handleCancelClick = () => {
        this.setState({ api: { isExecuting: false, isErrored: false }});
        this.props.handleClose();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.open && !nextProps.open) {
            this.setState({ ...initialState, paciente: { ...initialState.paciente, id: getGuid() }});
        }
  
        if (!this.props.open && nextProps.open) {
            if (nextProps.intent === INTENTS.EDIT) {
                this.setState({ paciente: nextProps.paciente });
            }
            else if (nextProps.intent === INTENTS.COPY) {
                this.setState({ paciente: { ...nextProps.paciente, id: getGuid() }});
            }
        }
    }


    render() {
        let refreshStyle = this.state.api.isExecuting ? { backgroundColor: grey300 } : {};

        return (
            <div>
                <Dialog
                    bodyStyle={refreshStyle}
                    actionsContainerStyle={refreshStyle}
                    titleStyle={refreshStyle}
                    contentStyle={{ ...styles.dialogContent, refreshStyle }}
                    title={(this.props.intent === INTENTS.ADD ? 'Agregar' : 'Editar') + ' Medicion'} 
                    autoScrollBodyContent={true}
                    actions={
                        <div>
                            <FlatButton 
                                label="Cancelar" 
                                onClick={this.handleCancelClick} 
                                disabled={this.state.api.isExecuting}
                            />
                            <SaveRetryFlatButton 
                                onClick={this.handleSaveClick} 
                                api={this.state.api} 
                                validation={this.state.validationErrors} 
                            />
                        </div>
                    }
                    modal={true}
                    open={this.props.open}
                >
                    <TextField
                        hintText="Ingrese un nombre"
                        floatingLabelText="Nombre"
                        defaultValue={this.state.paciente.name}
                        errorText={this.state.validationErrors.name}
                        style={styles.name}
                        onChange={this.handleNameChange}
                    /><br />
                    <TextField
                        hintText="ingrese una edad"
                        pattern="[0-9]*"
                        floatingLabelText="Edad"
                        defaultValue={this.state.paciente.age}
                        errorText={this.state.validationErrors.age}
                        style={styles.age}
                        onChange={this.handleAgeChange}
                    /><br />
                    <SelectField
                        floatingLabelText="Sexo"
                        value={this.state.paciente.genero}
                        onChange={this.handleTypeChange}
                        errorText={this.state.validationErrors.type}
                        style={styles.type}
                    >
                        {PACIENTE_TYPES.map(e => <MenuItem key={e} value={e} primaryText={e}/>)}
                    </SelectField><br/>
                    <TextField
                        hintText=""
                        floatingLabelText="Enfermedad Preexistente"
                        defaultValue={this.state.paciente.enfermedadesPre01}
                        style={styles.enfermedadesPre01}
                        errorText={this.state.validationErrors.enfermedadesPre01}
                        onChange={this.handleEnf1}
                    /><br />
                    <TextField
                        hintText=""
                        floatingLabelText="Enfermedad Preexistente"
                        defaultValue={this.state.paciente.enfermedadesPre02}
                        style={styles.enfermedadesPre02}
                        errorText={this.state.validationErrors.enfermedadesPre02}
                        onChange={this.handleEnf2}
                    /><br />
                    <TextField
                        hintText=""
                        floatingLabelText="Enfermedad Preexistente"
                        defaultValue={this.state.paciente.enfermedadesPre03}
                        style={styles.enfermedadesPre03}
                        errorText={this.state.validationErrors.enfermedadesPre03}
                        onChange={this.handleEnf3}
                    /><br />
                    {this.state.api.isExecuting ? <Spinner/> : ''}
                </Dialog>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    existingNames: state.pacientes.map(e => e.name),
});

const mapDispatchToProps = {
    addPaciente,
    updatePaciente,
    showSnackbar,
};

export default connect(mapStateToProps, mapDispatchToProps)(PacienteDialog);