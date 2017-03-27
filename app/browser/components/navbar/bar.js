import React from 'react';
import {Motion, spring} from 'react-motion';

import '../../../resources/browser/scss/bar.scss';

export default class Bar extends React.Component {
    constructor() {
        super();

        this.state = {
            top: -20,
            opacity: 0
        };

        this.openedPanel = false;
        this.locked = false;
    }

    componentDidMount() {
        var self = this;

        document.body.addEventListener('mousemove', function(e) {
            if (e.pageY > 120 && !self.locked && !self.openedPanel) {
                self.hide();
            }
            if (e.pageY <= 32) {
                self.show();
            }
        });
    }

    show = () => {
      this.setState(
        {
          opacity: spring(1, barAnimationsData.opacitySpring),
          top: spring(0, barAnimationsData.topSpring)
        }
      );
    }

    hide = () => {
      this.setState(
        {
          opacity: spring(0, barAnimationsData.opacitySpring),
          top: spring(-20, barAnimationsData.topSpring)
        }
      );
    }

    render() {
        return (
            <Motion style={{
                top: this.state.top,
                opacity: this.state.opacity
            }}>
                {value => <div style={{
                    marginTop: value.top,
                    opacity: value.opacity
                }} className="bar">
                    <div className="bar-search-icon"></div>
                    <div className="bar-hint">Search</div>
                </div>
}
            </Motion>
        );
    }
}
