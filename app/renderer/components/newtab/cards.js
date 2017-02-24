'use babel';
import React from 'react';
import ReactDOM from 'react-dom';

export default class Cards extends React.Component {
    constructor() {
        super();
        //global properties
        this.state = {
            contWidth: 0
        };
        this.cards = [];
    }
    componentDidMount() {
        window.addEventListener('resize', this.resize);
        this.resize();
    }
    /*
    * adjusts container width
    */
    resize = () => {
        try {
            var maxInLine = this.props.maxInLine,
                marginLeft = 8,
                i = 0,
                itemWidth = parseInt(this.cards[0].refs.root.offsetWidth, 10);

            var width = (itemWidth + marginLeft) * this.cards.length;
            while ((itemWidth + marginLeft) * (maxInLine - i) > window.innerWidth) {
                i += 1;
            }
            if (width / (itemWidth + marginLeft) > maxInLine - i) {

                width = (maxInLine - i) * (itemWidth + marginLeft);
            }

            this.setState({contWidth: width});
        } catch (err) {}
    }
    /*
    * gets cards
    * @return {Cards}
    */
    getCards = () => {
        return this;
    }
    render() {
        var t = this;
        return (
            <div ref="cards" className="cards" style={{
                width: this.state.contWidth
            }}>
                {this.props.children.map((child, index) => React.cloneElement(child, {
                    ref: (ref) => {
                        if (child.type.name == "Item") {
                            this.cards[index] = ref;
                        }
                    },
                    getCards: t.getCards
                }))}
            </div>
        );
    }
}
