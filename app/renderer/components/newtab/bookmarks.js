'use babel';
import React from 'react';
import ReactDOM from 'react-dom';

export default class Bookmarks extends React.Component {
    constructor() {
        super();
        this.state = {
            marginLeft: 8,
            itemWidth: 172,
            contwidth: 472
        };
        this.bookmarks = [];
        this.onResize = this.onResize.bind(this);
        this.getContainerWidth = this.getContainerWidth.bind(this);
    }
    componentDidMount() {
        this.onResize();
        window.addEventListener('resize', function (e) {
            this.onResize();
        });

        for(var i = 0; i < this.bookmarks.length; i++) {
            console.log(this.bookmarks[i].test());
        }

    }
    onResize(e) {
        var p = true;
        var count = 5;

        while(p) {
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
        //console.log(window.innerWidth);
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
