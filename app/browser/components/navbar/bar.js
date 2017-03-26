import React from 'react';
import {Motion, spring} from 'react-motion';

import '../../../resources/browser/scss/bar.scss';

export default class Bar extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <Motion style={{}}>
                {value =>
                  <div className="bar">
                    <div className="bar-search-icon"></div>
                    <div className="bar-hint">Search</div>
                  </div>
                }
            </Motion>
        );
    }
}
