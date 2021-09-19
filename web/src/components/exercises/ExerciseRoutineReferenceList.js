import React, { Component } from 'react';
import { connect } from 'react-redux';

import {List, ListItem} from 'material-ui/List';

import { red500 } from 'material-ui/styles/colors';
import ActionHighlightOff from 'material-ui/svg-icons/action/highlight-off';
import Spinner from '../shared/Spinner';

import { fetchRoutines } from '../routines/RoutinesActions';
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

class ExerciseRoutineReferenceList extends Component {
    state = {
        api: {
            isExecuting: false,
            isErrored: false,
        },
    }

    componentWillMount = () => {
        this.setState({ api: { ...this.state.api, isExecuting: true }});

        this.props.fetchRoutines()
        .then(() => {
            this.setState({ api: { ...this.state.api, isExecuting: false }});
        }, error => {
            this.props.showSnackbar('Error fetching Routines: ' + error);
            this.setState({ api: { isExecuting: false, isErrored: true }});
        });
    }

    render() {
        let routines = this.props.routines
                        .filter(r => r.exercises.find(e => e.id === this.props.exercise.id));

        return (
            <div style={styles.container}>
                {this.state.api.isExecuting ? <Spinner style={styles.spinner}/> : 
                    this.state.api.isErrored ? <ActionHighlightOff style={{ ...styles.icon, color: red500 }} /> :
                        <div>
                            {routines.length > 0 ? 
                                <div>
                                    <p>Esta medicion es utilizanda en {routines.length} estudio{routines.length === 1 ? '' : 's'}:</p>

                                    <List>
                                        {routines.map(r => 
                                            <ListItem key={r.id} primaryText={r.name} />
                                        )}
                                    </List>

                                    <p>Al Borrar la medicion se eliminara su aparicion en estudios.</p>
                                </div>
                            : <p>Esta medicion no es utilizada en ningun estudio.</p>}
                        </div>
                } 
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    routines: state.routines,
});

const mapDispatchToProps = {
    fetchRoutines,
    showSnackbar,
};

export default connect(mapStateToProps, mapDispatchToProps)(ExerciseRoutineReferenceList);

