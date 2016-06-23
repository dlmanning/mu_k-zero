import * as React from 'react'
import { Slider } from './slider'

export interface SliderContainerProps {
  index: number,
  onIndexChange: (newIndex: number) => never,
  children?: any
}

export interface SliderContainerState {
  index: number,
}

export class SliderContainer extends React.Component<SliderContainerProps, SliderContainerState> {
  constructor (props: SliderContainerProps) {
    super(props)

    this.state = {
      index: 0
    }
  }

  applyNextState (next: SliderContainerState) {
    if (this.state.index !== next.index) {
      this.setState(next, () => {
        if (next.index !== this.props.index) {
          this.props.onIndexChange(next.index)
        }
      })
    }
  }

  shouldComponentUpdate (nextProps: SliderContainerProps) {
    return nextProps.index !== this.props.index
  }

  componentWillReceiveProps (nextProps: SliderContainerProps) {
    const oldKeys = mapToElementKeys(this.props.children)
    const newKeys = mapToElementKeys(nextProps.children)
    const nextState: SliderContainerState = { index: this.state.index }

    if (nextProps.index !== this.props.index) {
      nextState.index = nextProps.index
    }

    if (childrenHaveChanged(oldKeys, newKeys)) {
      const { index } = this.state
      const currentKey = oldKeys[index]
      const indexInNext = newKeys.indexOf(currentKey)

      if (indexInNext !== -1) {
        nextState.index = indexInNext
      } else {
        const searchOrder: React.Key[] = []
        for (let i = oldKeys.length - 1; i > 0; i--) {
          const j = Math.ceil(i / 2)
          if (index + j >= oldKeys.length) {
            searchOrder.push(oldKeys[oldKeys.length - (i + 1)])
          } else if (index - j < 0) {
            searchOrder.push(oldKeys[i])
          } else if (i % 2 === 0) {
            searchOrder.push(oldKeys[index + j])
          } else {
            searchOrder.push(oldKeys[index - j])
          }
        }

        let nearestIndexInNext: number = 0
        while (
          searchOrder.length &&
          (nearestIndexInNext = newKeys.indexOf(searchOrder[searchOrder.length - 1])) === -1
        ) searchOrder.pop()

        nextState.index = nearestIndexInNext !== -1
          ? nearestIndexInNext
          : 0
      }
    }

    this.applyNextState(nextState)
  }

  render () {
    return (
      <Slider index={this.props.index}>
        {this.props.children}
      </Slider>
    )
  }
}

function mapToElementKeys (children: React.ReactNode): React.Key[] {
  return React.Children.toArray(children).reduce((accum, child) => {
    if (React.isValidElement(child)) {
      accum.push(child.key)
    }
  
  return accum
  }, [])
}

function childrenHaveChanged (oldKeys: React.Key[], newKeys: React.Key[]): boolean {
  if (oldKeys.length !== newKeys.length) {
    return true
  }

  oldKeys.sort()
  newKeys.sort()

  return oldKeys.some((key, idx) => key !== newKeys[idx])
}
