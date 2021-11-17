import React, { Component } from 'react';

import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import Select from 'material-ui/SelectField'
import LogoutButton from '../security/LogoutButton';
import ArrowUpward from 'material-ui/svg-icons/navigation/arrow-upward';
import { MenuItem } from 'material-ui';

class AppContainer extends Component {
    state = {
        drawerOpen: false,
    }   

    toggleDrawer = () => {
        this.setState({ drawerOpen: !this.state.drawerOpen });
    }

    render() {
        return (
            <div>
                {!this.props.show ? '' :
                    <div>
                        <AppBar 
                            title={this.props.title}
                            style={styles.appBar}
                            onLeftIconButtonClick={this.toggleDrawer}
                        >
                            <LogoutButton/>
                        </AppBar>
                        <Drawer 
                            open={this.state.drawerOpen}
                            docked={false}
                            onRequestChange={this.toggleDrawer}
                        >
                            <img style={styles.iconForeground} src="/img/logo.png" alt="" />

                            
                            {this.props.links}
                        </Drawer>
                    </div>
                }
                {this.props.children}
            </div>
        );
    }
}

const styles = {
    appBar: {
        position: 'fixed',
        left: 0,
        top: 0,
    },
};

export default AppContainer;