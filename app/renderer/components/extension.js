'use babel';
import React from 'react';

export default class Extension extends React.Component {
    constructor() {
        super();
        //global properties
        this.data = null;
        this.state = {
            backgroundImage: null
        }
    }
    componentDidMount() {
        this.data = this.props.object;
        this.setState({backgroundImage: 'url(' + this.data.icon + ')'});
    }
    /*
    events
    */
    onClick(e, self) {
        makeRippleFromCenter(e.target, 14);
    }

    render() {
        return (
            <div onMouseDown={(e)=> this.onClick(e, this)} className="ripple-icon extension" style={{backgroundImage: this.state.backgroundImage}}>

            </div>
        );
    }
}
