import React, { Component } from 'react';

import Avatar from 'material-ui/Avatar';
import { ActionAssessment, ActionWatchLater, ActionSpeakerNotes } from 'material-ui/svg-icons';
import { black } from 'material-ui/styles/colors';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import LeftRightListItem from '../shared/LeftRightListItem';
import ToggledLeftRightListItem from '../shared/ToggledLeftRightListItem';
import { List } from 'material-ui/List';

import { CARD_WIDTH, PACIENTE_TYPES, PACIENTE_AVATAR_COLOR } from '../../constants';
import { getElapsedTime } from '../../util';

const styles = {
    cardHeader: {
        backgroundColor: PACIENTE_AVATAR_COLOR,
        marginBottom: 0,
    },
    cardTitle: {
        fontSize: '20px',
        marginTop: 6,
    },
    card: {
        width: CARD_WIDTH - 35,
        height: '100%',
        position: 'relative',
        marginBottom: 20,
        marginLeft: 5,
        marginTop: 5,
    },
    link: {
        cursor: 'pointer',
    },
    notes: {
        marginLeft: 20,
    },
};

class PacienteReportCard extends Component {
    getMetricDisplayName = (metric) => {
        return metric.name + (metric.uom ? ' (' + metric.uom + ')' : '');
    }

    render() {
        let pacienteImage = this.props.paciente.type;
        if (PACIENTE_TYPES.indexOf(pacienteImage) === -1) { 
            pacienteImage = 'unknown';
        }

        return (
            <div>
                <Card 
                    zDepth={2} 
                    style={styles.card}
                >
                    <CardHeader                        
                        titleStyle={styles.cardTitle}
                        style={styles.cardHeader}
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
                                backgroundColor={PACIENTE_AVATAR_COLOR} 
                                size={32} 
                                src={process.env.PUBLIC_URL + '/img/' + pacienteImage.toLowerCase() + '.png'} 
                            />
                        }
                    >
                    </CardHeader>
                    <CardText style={styles.text}>
                        <List>
                            {!this.props.paciente.metrics ? '' :
                                this.props.paciente.metrics.map((m, index) =>    
                                    <LeftRightListItem
                                        key={index}
                                        leftIcon={<ActionAssessment color={ black }/>} 
                                        leftText={this.getMetricDisplayName(m)}
                                        rightText={m.value ? m.value : '-'}
                                    />
                                )
                            }

                            {!this.props.paciente.notes ? '' :
                                <ToggledLeftRightListItem
                                    leftIcon={<ActionSpeakerNotes color={black}/>}
                                    leftText={'Notas'}
                                    defaultToggleOpen={false}
                                >
                                    <p>{this.props.paciente.notes}</p>
                                </ToggledLeftRightListItem>
                            }
                        </List>
                    </CardText>
                </Card>
            </div>
        );
    }
}

export default PacienteReportCard;