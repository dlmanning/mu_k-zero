const React = require('react')
const ReactDOM = require('react-dom')
const TestApp = require('./app')

const $root = document.createElement('div')
document.querySelector('body').appendChild($root)

ReactDOM.render(React.createElement(TestApp), $root)
