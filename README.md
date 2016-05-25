#React Viewmaster

A carousel-like component that slides children in and out of view.

## Example usage

```javascript
class MyComponent extends Component {
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
      <div style={{ margin: '0 50', height: 250, width: 400 }}>
        <button onClick={this.toggle}>Toggle</button>
        <h3>{ this.state.index / children.length }</h3>
        <Slider index={this.state.index}>
          {children}
        </Slider>
        <button onClick={this.back}>Back</button>
        <button onClick={this.forward}>Forward</button>
      </div>
    )
  }
}
```
