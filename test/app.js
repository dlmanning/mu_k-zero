'use strict'

const React = require('react')
const instyled = require('instyled')
const SliderComponent = require('../').SliderContainer

const {
  DOM: {
    div,
    button,
    h3
  },
  Component,
} = React

const Slider = React.createFactory(SliderComponent)
const LetterBox = React.createFactory(instyled({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  width: '100%',
  fontSize: '7em',
  alignSelf: 'center'
}))

const colors = ['#c95e02', '#ffa714', '#f4e4ae', '#0082a5', '#013746']

const makeSlides = howMany => {
  const slides = []

  for (let i = 0; i < howMany; i++) {
    const style = {
      backgroundColor: colors[i % 4]
    }

    slides.push(
      LetterBox({ mergeStyle: style, key: i }, i + 1)
    )
  }

  return slides
}

const slides = makeSlides(20)

class App extends Component {
  constructor () {
    super()

    this.state = {
      toggle: true,
      index: 0
    }
    
    this.toggle = this.toggle.bind(this)
    this.forward = this.forward.bind(this)
    this.back = this.back.bind(this)
  }

  setIndex (index) {
    console.log(index)
    this.setState({ index })
  }

  toggle () {
    this.setState({ toggle: !this.state.toggle })
  }

  forward () {
    this.setState({
      index: this.state.index + 1
    })
  }

  back () {
    this.setState({
      index: this.state.index - 1
    })
  }

  render () {
    const children = slides.filter((_, idx) =>
      idx % (this.state.toggle ? 2 : 1) === 0)

    return (
      div({ style: { margin: '0 50', height: 250, width: 400 } },
        button({ onClick: this.toggle }, "Toggle"),
        h3(null, `(${this.state.index} / ${children.length})`),
        Slider({ index: this.state.index, onIndexChange: newIndex => this.setIndex(newIndex) },
          children
         ),
        button({ onClick: this.back }, "Back"),
        button({ onClick: this.forward }, "Forward")
      )
    )
  }
}

module.exports = App
