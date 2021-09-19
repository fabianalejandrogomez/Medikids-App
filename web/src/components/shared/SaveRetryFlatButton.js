import React, { Component } from 'react';

import FlatButton from 'material-ui/FlatButton';

class SaveRetryFlatButton extends Component {
    render() {
        return (
            <FlatButton 
                label={this.props.api.isErrored ? 'Reintentar' : this.props.label ? this.props.label : 'Guardar'}
                onClick={this.props.onClick} 
                disabled={
                    (Object.keys(this.props.validation)
                        .find(e => this.props.validation[e] !== '') !== undefined) || (this.props.api.isExecuting)
                }
                style={this.props.style}
            />
        );
    }
}

export default SaveRetryFlatButton;
