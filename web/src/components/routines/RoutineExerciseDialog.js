import React, { Component } from 'react';

import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const styles = {
    dialog: {
        width: 400,
    },
    exercise: {
        width: '100%',
    },
};

const initialState = {
    exercise: { _id: undefined },
};

class RoutineExerciseDialog extends Component {
    state = initialState;

    handleAddClick = (result) => {
        this.props.handleClose({ added: true, exercise: this.state.exercise });
    }

    handleCancelClick = () => {
        this.props.handleClose({ cancelled: true });
    }

    handleExerciseChange = (event, index, value) => {
        this.setState(prevState => ({
            exercise: this.props.exercises.find(e => e._id === value),
        }));
    }

    componentWillReceiveProps(nextProps) {
        this.setState(initialState);
    }

    render() {
        return (
            <Dialog
                title={'Agregar Medicion'} 
                actions={
                    <div>
                        <FlatButton
                            label="Cancelar"
                            onClick={this.handleCancelClick}
                        />
                        <FlatButton
                            label="Guardar"
                            onClick={this.handleAddClick}
                        />
                    </div>
                }
                modal={true}
                open={this.props.open}
                contentStyle={styles.dialog}
            >
                <SelectField
                    floatingLabelText="Medicion"
                    value={this.state.exercise.id}
                    onChange={this.handleExerciseChange}
                    style={styles.exercise}
                >
                    {this.props.exercises.map(e => 
                        <MenuItem 
                            key={e._id} 
                            value={e._id} 
                            primaryText={e.name}
                             leftIcon={
                                <img 
                                    alt={e.type} 
                                    style={styles.leftIcon} 
                                    src={process.env.PUBLIC_URL + '/img/' + e.type.toLowerCase() + '.png'}
                                />
                            } 
                        />
                    )}
                </SelectField>
            </Dialog>
        );
    }
}

export default RoutineExerciseDialog;
