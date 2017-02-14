'use babel';
import React from 'react';
import Checkbox from '../materialdesign/checkbox.js';

export default class Item extends React.Component {
    constructor() {
        super()
        //binds
        this.checkedChanged = this.checkedChanged.bind(this);
        //global properties

    }
    componentDidMount() {

    }
    checkedChanged(e) {
        var checkedItems = this.props.getHistory().state.checkedItems;
        if (e.checked) {
            checkedItems += 1;
        } else {
            checkedItems -= 1;
        }
        if (checkedItems > 0) {
            this.props.getHistory().toggleToolbar(2);
            this.props.getHistory().setState({checkedItems: checkedItems});
        } else {
            this.props.getHistory().toggleToolbar(1);
            this.props.getHistory().setState({checkedItems: checkedItems});
        }
    }
    render() {
        return (
            <div>
                <Checkbox onCheckedChanged={this.checkedChanged} className="history-item-checkbox"></Checkbox>
                <div className="history-item-hour history-item">11:42</div>
                <div className="history-item-title history-item">Facebook</div>
                <div className="history-item-domain history-item">www.facebook.com</div>
            </div>
        )
    }
}
