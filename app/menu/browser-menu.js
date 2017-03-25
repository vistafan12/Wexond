import React from 'react';
import {Motion, spring} from 'react-motion';
import TabLayout from '../material-design/tab-layout';

import '../resources/menu/scss/menu.scss';

export default class BrowserMenu extends React.Component {
    constructor() {
        super();

        this.state = {
            opacity: 0,
            top: 0
        };

        this.tabLayout = null;
    }

    componentDidMount() {
        var self = this;
        ipcRenderer.on('browser-menu:show-animation', function() {
            self.show();
        });
        ipcRenderer.on('browser-menu:hide-animation', function() {
            self.hide();
        });
        window.addEventListener('click', this.hide);

        this.tabLayout.setState({
            tabs: [
                {title: "ACTIONS"},
                {title: "MENU"},
                {title: "APPS"}
            ]
        })
    }
    /*
    * hides menu
    */
    hide = () => {
        this.setState(
            {
                opacity: spring(0, menuAnimationData.opacitySpring),
                top: spring(0, menuAnimationData.topSpring)
            }
        );
        remote.getCurrentWindow().setIgnoreMouseEvents(true);
    }
    /*
    * shows menu
    */
    show = () => {
        remote.getCurrentWindow().setIgnoreMouseEvents(false);
        remote.getCurrentWindow().focus();
        this.setState(
            {
                opacity: spring(1, menuAnimationData.opacitySpring),
                top: spring(40, menuAnimationData.topSpring)
            }
        );
    }
    /*
    events
    */
    onClick = (e) => {
        e.stopPropagation();
    }

    onBackClick = () => {
        this.hide();
    }

    render() {
        return (
            <div>
                <Motion style={{
                    opacity: this.state.opacity,
                    top: this.state.top
                }}>
                {value =>
                    <div onClick={this.onClick} className="menu" style={{opacity: value.opacity, marginTop: value.top}}>
                        <div className="icons">
                            <div className="icon" onClick={this.onBackClick} style={{backgroundImage: 'url(../browser/img/bar/back.png)'}}>

                            </div>
                            <div className="icon" style={{backgroundImage: 'url(../browser/img/bar/forward.png)'}}>

                            </div>
                            <div className="icon" style={{backgroundImage: 'url(../browser/img/bar/refresh.png)'}}>

                            </div>
                            <div className="icon" style={{backgroundImage: 'url(../browser/img/bar/star_empty.png)'}}>

                            </div>
                            <div className="border-bottom"></div>
                        </div>
                        <TabLayout ref={(t) => this.tabLayout = t}>
                            <div className="border-bottom"></div>
                        </TabLayout>
                    </div>}
                </Motion>
            </div>
        )
    }
}
