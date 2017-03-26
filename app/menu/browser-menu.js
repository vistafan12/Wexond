import React from 'react';
import {Motion, spring} from 'react-motion';
import TabLayout from '../material-design/tab-layout';

import '../resources/menu/scss/menu.scss';

export default class BrowserMenu extends React.Component {
    constructor() {
        super();

        this.state = {
            opacity: 0,
            top: 0,
            height: 90
        };

        this.tabLayout = null;
        this.menu = null;

        this.menuItems = null;
        this.menuToolbar = null;

        this.mouseX = null;
        this.mouseY = null;
    }

    componentDidMount() {
        var self = this;
        var isFirstTime = true;
        ipcRenderer.on('browser-menu:show-animation', function(e, mouseX, mouseY) {
            self.mouseX = mouseX;
            self.mouseY = mouseY;

            self.setPosition();

            if (isFirstTime) {
                self.tabLayout.selectTab(self.tabLayout.tabs[0]);
                isFirstTime = false;
            }
            self.show();
        });
        ipcRenderer.on('browser-menu:hide-animation', function() {
            self.hide();
        });
        window.addEventListener('click', this.hide);

        this.tabLayout.setState({
            tabs: [
                {title: "ACTIONS"},
                {title: "MENU", page: this.menuItems},
                {title: "APPS"}
            ]
        })
    }
    setPosition = () => {
        var screenHeight = window.screen.availHeight;
        var screenWidth = window.screen.availWidth;
        var height = this.menu.offsetHeight;
        var x = this.mouseX - 7;
        var y = this.mouseY - 39;

        if (this.mouseX + this.menu.offsetWidth >= screenWidth) {
            x = this.mouseX - this.menu.offsetWidth - 8;
        }
        if (this.mouseY + height >= screenHeight) {
            y = this.mouseY - height - 40;
        }

        if (y < 0) {
            y = 32;
        }

        remote.getCurrentWindow().setPosition(x, y);
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

    onSelect = (e) => {
        var height;
        if (e.page != null) {
            height = 90 + 8 + e.page.offsetHeight;
        } else {
            height = 90 - 8;
        }
        this.setState({height: spring(height, menuAnimationData.menuHeightSpring)});

        var y = remote.getCurrentWindow().getPosition()[1];
        var x = remote.getCurrentWindow().getPosition()[0];
        var yFromDown = y + height;
        var screenHeight = window.screen.availHeight;

        if (yFromDown > screenHeight) {
            remote.getCurrentWindow().setPosition(x, screenHeight - height - 128);
        }
    }

    render() {
        return (
            <div>
                <Motion style={{
                    opacity: this.state.opacity,
                    top: this.state.top,
                    height: this.state.height
                }}>
                {value =>
                    <div ref={(t) => this.menu = t} onClick={this.onClick} className="menu" style={{opacity: value.opacity, marginTop: value.top, height: value.height}}>
                        <div ref={(t) => this.menuToolbar = t} className="menu-toolbar">
                            <div className="icons">
                                <div className="icon" onClick={this.onBackClick} style={{backgroundImage: 'url(../browser/img/bar/back.png)'}}>

                                </div>
                                <div className="icon" style={{backgroundImage: 'url(../browser/img/bar/forward.png)'}}>

                                </div>
                                <div className="icon" style={{backgroundImage: 'url(../browser/img/bar/refresh.png)'}}>

                                </div>
                                <div className="icon" style={{backgroundImage: 'url(../browser/img/bar/star_empty.png)'}}>

                                </div>
                            </div>
                            <TabLayout onSelect={this.onSelect} ref={(t) => this.tabLayout = t}>

                            </TabLayout>
                        </div>
                        <div className="menu-items" ref={(t) => this.menuItems = t}>
                            <div className="menu-item">
                                Fullscreen
                            </div>
                            <div className="menu-item">
                                New window
                            </div>
                            <div className="menu-item">
                                Private mode
                            </div>
                            <div className="menu-separator"></div>
                            <div className="menu-item">
                                History
                            </div>
                            <div className="menu-item">
                                Bookmarks
                            </div>
                            <div className="menu-item">
                                Downloads
                            </div>
                            <div className="menu-separator"></div>
                            <div className="menu-item">
                                Find
                            </div>
                            <div className="menu-item">
                                Print
                            </div>
                            <div className="menu-item">
                                Take screenshot
                            </div>
                            <div className="menu-separator"></div>
                            <div className="menu-item">
                                Settings
                            </div>
                            <div className="menu-item">
                                Help
                            </div>
                        </div>
                    </div>}
                </Motion>
            </div>
        )
    }
}
