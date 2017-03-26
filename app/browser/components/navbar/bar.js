import React from 'react';
import {Motion, spring} from 'react-motion';

import '../../../resources/browser/scss/bar.scss';

export default class Bar extends React.Component {
    constructor() {
        super();

        this.state = {
            opacity: 0,
            isVisible: false
        }
    }

    onClick = () => {
        this.hide();
    }

    hide = () => {
        var self = this;
        this.setState({opacity: spring(0)});
        setTimeout(function() {
            self.setState({isVisible: false});
        }, 300);
    }

    show = () => {
        this.setState({isVisible: true, opacity: spring(1)});
    }

    render() {
        return (
            <Motion style={{opacity: this.state.opacity}}>
                {value =>

                     <div className="bar-root" style={{opacity: value.opacity, display: (this.state.isVisible) ? 'block' : 'none'}}>
                        <div style={this.props.style} className="bar">
                        </div>
                        <div onClick={this.onClick} className="black-screen">
                        </div>
                    </div>
                }
            </Motion>
        );
    }
}
