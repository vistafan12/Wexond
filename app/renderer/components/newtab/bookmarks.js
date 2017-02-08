'use babel';
import React from 'react';
import ReactDOM from 'react-dom';

export default class Bookmarks extends React.Component {
    constructor() {
        super();
        //binds
        this.resize = this.resize.bind(this);
        this.getContainerWidth = this.getContainerWidth.bind(this);
        //global properties
        this.state = {
            marginLeft: 8,
            itemWidth: 172,
            contwidth: 472
        };
        this.bookmarks = [];

    }
    componentDidMount() {
        this.resize();
        window.addEventListener('resize', this.resize);

        /*for(var i = 0; i < this.bookmarks.length; i++) {
            console.log(this.bookmarks[i].test());
        }*/

    }
    resize() {
        var p = true;
        var count = 5;

        /*while(p) {
            var w = this.getContainerWidth(count, this.state.marginLeft, this.state.itemWidth);
            if (w > this.state.contWidth) {
                count--;
            } else {
                this.setState({contWidth: w});
                p = true;
            }
            if (count < 1) {
                p = true;
                console.log("error");
            }
        }
        //console.log(window.innerWidth);*/
    }
    getContainerWidth(count, mleft, width) {
        return count * mleft + count * width;
    }
    render() {
        return (
            <div className="bookmarks" style={{width: this.state.contwidth}}>
                {this.props.children.map((child, index) =>
                  React.cloneElement(child, {ref: (ref) => { this.bookmarks[index] = ref }})
                )}
            </div>
        );
    }
}
