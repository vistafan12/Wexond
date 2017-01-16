'use babel';
import React from 'react';

export default class MDMenu extends React.Component {
    constructor() {
        super()
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this.menu = this.menu.bind(this);
          this.openedMenu = false;
    }

    componentDidMount() {
    }

    render() {
        return (
            <div className="menu" ref="menu"></div>
        )
    }

    show() {
        $(this.refs.menu).css('display', 'block');
        $(this.refs.menu).animate({top: 48}, {duration: 300, queue: false});
        $(this.refs.menu).animate({opacity: 1}, {duration: 300, queue: false});
        this.openedMenu = true;
    }

    hide() {
        var t = this;
        $(this.refs.menu).animate({top: 0}, {duration: 300, queue: false});
        $(this.refs.menu).animate({opacity: 0}, {duration: 300, queue: false, complete: function() {
          $(this).css('display', 'none');
          t.openedMenu = false;
        }});
    }

    menu() {
      if(this.openedMenu) {
        this.hide();
      } else {
        this.show();
      }
      console.log(this.openedMenu);
    }
}
