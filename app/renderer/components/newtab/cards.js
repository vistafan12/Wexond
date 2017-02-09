'use babel';
import React from 'react';
import ReactDOM from 'react-dom';

export default class Cards extends React.Component {
    constructor() {
        super();
        //binds
        this.resize = this.resize.bind(this);
        this.getContainerWidth = this.getContainerWidth.bind(this);
        //global properties
        this.state = {
            marginLeft: 32,
            itemWidth: 172,
            contWidth: 472
        };
        this.bookmarks = [];

    }
    componentDidMount() {
        this.resize();

        window.addEventListener('resize', this.resize);
    }
    resize() {
        var p = true;
        var count = this.props.maxInLine;

        while (p) {
            var w = this.getContainerWidth(count, this.state.marginLeft, this.state.itemWidth);
            if (window.innerWidth < w) {
                count--;
            } else {
                this.setState({contWidth: w});
                p = false;
            }
            if (count < 1) {
                p = false;
                console.log("error");
            }
        }
    }
    getContainerWidth(count, mleft, width) {
        return count * mleft + count * width;
    }
    render() {
        return (
            <div ref="cards" className="cards" style={{
                width: this.state.contWidth
            }}>
                {this.props.children.map((child, index) => React.cloneElement(child, {
                    ref: (ref) => {
                        if (child.type.name == "Item") {
                            this.bookmarks[index] = ref;
                        }
                    }
                }))}
            </div>
        );
    }
}
