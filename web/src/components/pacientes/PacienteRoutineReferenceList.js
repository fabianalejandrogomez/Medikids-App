import React, { Component } from 'react';
import { connect } from 'react-redux';

import {List, ListItem} from 'material-ui/List';

import { red500 } from 'material-ui/styles/colors';
import ActionHighlightOff from 'material-ui/svg-icons/action/highlight-off';
import Spinner from '../shared/Spinner';

import { fetchRoutines } from '../routines/RoutinesActions';
import { fetchWorkouts } from '../workouts/WorkoutsActions';
import { showSnackbar } from '../app/AppActions';

const styles = {
    icon: {
        height: 40,
        width: 40,
        margin: 'auto',
        display: 'block',
        top: '10px',
    },
    container: {
        display: 'block',
        minHeight: 40,
    },
    spinner: {
        top: 60,
    },
};

class PacienteRoutineReferenceList extends Component {
    state = {
        api: {
            isExecuting: false,
            isErrored: false,
        },
    }

    componentWillMount = () => {
        this.setState({ api: { ...this.state.api, isExecuting: true }});

        this.props.fetchWorkouts()
        .then(() => {
            this.setState({ api: { ...this.state.api, isExecuting: false }});
        }, error => {
            this.props.showSnackbar('Error fetching Workouts: ' + error);
            this.setState({ api: { isExecuting: false, isErrored: true }});
        });
    }

    render() {
        let workouts = this.props.workouts.filter(e => e.paciente._id === this.props.paciente._id);
        console.log(workouts)

        return (
            <div style={styles.container}>
                {this.state.api.isExecuting ? <Spinner style={styles.spinner}/> : 
                    this.state.api.isErrored ? <ActionHighlightOff style={{ ...styles.icon, color: red500 }} /> :
                        <div>
                            {workouts.length > 0 ? 
                                <div>
                                    <p>Este paciente es utilizado en {workouts.length} estudio{workouts.length === 1 ? '' : 's'}:</p>

                                    <List>
                                        {workouts.map(r => 
                                            <ListItem key={r._id} primaryText={r.routine.name + " " + Date(r.scheduledTime)} />
                                        )}
                                    </List>

                                    <p>Al Borrar al paciente se eliminara su aparicion en estudios.</p>
                                </div>
                            : <p>Este paciente no es utilizado en ningun estudio.</p>}
                        </div>
                } 
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    workouts: state.workouts,
});

const mapDispatchToProps = {
    fetchWorkouts,
    showSnackbar,
};

export default connect(mapStateToProps, mapDispatchToProps)(PacienteRoutineReferenceList);

