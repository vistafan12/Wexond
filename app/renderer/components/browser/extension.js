'use babel';
import React from 'react';

export default class Extension extends React.Component {
    constructor() {
        super();
        //global properties
        this.data = null;
        this.state = {
            backgroundImage: null
        };
    }
    componentDidMount() {
        this.data = this.props.object;
        this.setState({
            backgroundImage: 'url(' + this.data.icon + ')'
        });
    }
    /*
    events
    */
    onMouseDown(e) {
        var ripple = Ripple.createRipple(e.target, {}, createRippleCenter(e.target));
        Ripple.makeRipple(ripple);
    }

    render() {
        return (
            <div onMouseDown={this.onMouseDown} className="ripple-icon extension" style={{
                backgroundImage: this.state.backgroundImage
            }}></div>
        );
    }
}
