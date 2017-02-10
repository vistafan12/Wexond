'use babel';
import React from 'react';
import ReactDOM from 'react-dom';

export default class Cards extends React.Component {
    constructor() {
        super();
        //binds
        this.resize = this.resize.bind(this);
        //global properties
        this.state = {
            contWidth: 0
        };
        this.bookmarks = [];

    }
    componentDidMount() {
        this.resize();
        window.addEventListener('resize', this.resize);
    }
    resize() {
        var maxInLine = this.props.maxInLine,
            marginLeft = 8,
            i = 0,
            itemWidth = parseInt(this.bookmarks[0].refs.root.offsetWidth, 10);

        var width = (itemWidth + marginLeft) * this.bookmarks.length;
        while ((itemWidth + marginLeft) * (maxInLine - i) > window.innerWidth) {
            i += 1;
        }
        if (width / (itemWidth + marginLeft) > maxInLine - i) {

            width = (maxInLine - i) * (itemWidth + marginLeft);
        }

        this.setState({contWidth: width});
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
