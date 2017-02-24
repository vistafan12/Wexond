'use babel';
import React from 'react';
import ReactDOM from 'react-dom';
import {TweenMax, CSSPlugin} from 'gsap';

export default class Item extends React.Component {
    constructor() {
        super();
        //global properties
        this.state = {
          color: "#000"
        };
    }
    componentDidMount() {
      var brightness = this.colorBrightness(this.props.data.backgroundColor);
      if (brightness < 125) {
          this.setState({color: '#fff'});
      } else {
          this.setState({color: '#000'});
      }
      console.log(this.props.data.icon);
    }
    /*
    events
    */
    /*
    * @param1 {Object} e
    */
    MouseClick = (e) => {
        if (e.target == this.refs.root) {
            window.location.href = this.props.data.url;
        }
    }
    /*
    * @param1 {Object} e
    */
    ripple = (e) => {
        var ripple = Ripple.createRipple(this.refs.root, {
            backgroundColor: this.state.color
        }, createRippleMouse(this.refs.root, e, 1.2));
        Ripple.makeRipple(ripple);
    }
    render() {
        return (
            <div ref="root" className="card-item ripple" style={{backgroundColor: this.props.data.backgroundColor, color: this.state.color}} onMouseDown={this.ripple}onClick={this.MouseClick}>
                <img ref="icon" className="icon noselectable" src={this.props.data.icon} />
                <div ref="title" className="title noselectable">{this.props.data.name}</div>
            </div>
        );
    }
}
