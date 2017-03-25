import React from 'react';
import {Motion, spring} from 'react-motion';
import Toolbar from '../material-design/toolbar.js';

import '../resources/menu/scss/menu.scss';

export default class BrowserMenu extends React.Component {
    constructor() {
        super();

        this.state = {
            opacity: 0,
            top: 0
        };
    }

    componentDidMount() {
        var self = this;
        ipcRenderer.on('browser-menu:show-animation', function() {
            self.show();
        });
        ipcRenderer.on('browser-menu:hide-animation', function() {
            self.hide();
        });
        window.addEventListener('click', this.hide);
    }

    hide = () => {
        this.setState(
            {
                opacity: spring(0, menuAnimationData.opacitySpring),
                top: spring(0, menuAnimationData.topSpring)
            }
        );
        remote.getCurrentWindow().setIgnoreMouseEvents(true);
    }

    show = () => {
        remote.getCurrentWindow().setIgnoreMouseEvents(false);
        remote.getCurrentWindow().focus();
        this.setState(
            {
                opacity: spring(1, menuAnimationData.opacitySpring),
                top: spring(40, menuAnimationData.topSpring)
            }
        );
    }

    onClick = (e) => {
        e.stopPropagation();
    }

    render() {
        return (
            <div>
                <Motion style={{
                    opacity: this.state.opacity,
                    top: this.state.top
                }}>
                {value =>
                    <div className="menu" style={{opacity: value.opacity, marginTop: value.top}}>
                        <div onClick={this.onClick}>
                            <Toolbar>

                            </Toolbar>
                        </div>
                    </div>}
                </Motion>
            </div>
        )
    }
}
