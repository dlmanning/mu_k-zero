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
  private _childrenHaveChanged: boolean

  constructor (props: SliderContainerProps) {
    super(props)

    // Do the kids seem... different?
    this._childrenHaveChanged = false
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
    const shouldItUpdate = (nextProps.index !== this.props.index) || this._childrenHaveChanged
    this._childrenHaveChanged = false
    return shouldItUpdate
  }

  componentWillReceiveProps (nextProps: SliderContainerProps) {
    const oldKeys = mapToElementKeys(this.props.children)
    const newKeys = mapToElementKeys(nextProps.children)
    const nextState: SliderContainerState = { index: this.state.index }

    this._childrenHaveChanged = childrenHaveChanged(oldKeys, newKeys)

    if (nextProps.index !== this.props.index) {
      nextState.index = nextProps.index
    }

    if (this._childrenHaveChanged) {
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

    this._childrenHaveChanged = true
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
  return React.Children.toArray(children).reduce((accum: (string | number)[], child: React.ReactNode) => {
    if (React.isValidElement(child) && child.key != null) {
      accum.push(child.key)
    } else {
      throw new Error('SliderContainer: passed child either is not a ReactElement or has no key')
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
