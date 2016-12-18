'use babel';
import React from 'react'

export default class Extensions extends React.Component {
    constructor() {
        super()
    }
    componentDidMount() {

    }
    render() {
        var srcDoc = "<html><body><script src='lib/zepto.min.js'></script><script src='js/utils.js'></script><script src='app/classes/api.js'></script></body></html>"
        return (<iframe ref="iframe" className="extensions-iframe" srcDoc={srcDoc}></iframe>)
    }
}
