import React = require('react')
import { Children, Component, ReactElement, ReactNode, ReactChild, PropTypes } from 'react'

import {
  TransitionMotion,
  spring,
  TransitionStyle,
  TransitionPlainStyle,
  SpringHelperConfig,
  OpaqueConfig
} from 'react-motion'

const ContainerStyles = {
  position: 'relative',
  height: '100%',
  width: '100%',
  overflow: 'hidden',
  border: '1px solid black'
}

const ChildContainerStyles = {
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  height: '100%'
}

const SliderSpring: SpringHelperConfig = {
  stiffness: 291,
  damping: 29
}

const TrackStyle = {
  display: 'flex',
  position: 'relative',
  flexDirection: 'row',
  height: '100%'
}

interface TrackProps {
  width: number,
  left: number,
  children?: any
}

function Track ({ width, left, children }: TrackProps): ReactElement<any> {
  const style = Object.assign({}, TrackStyle, {
    width: width + '%',
    left: left + '%'
  })

  return (
    <div key="track" style={style}>
      {children}
    </div>
  )
}

export interface SliderProps {
  index: number
  children?: any
}

export class Slider extends Component<SliderProps, any> {
  
  static propTypes = {
    index: PropTypes.number.isRequired,
    children: PropTypes.arrayOf(PropTypes.element)
  }
  
  private getTrackStyle = (): TransitionStyle[] => {
    const numberOfChildren = Children.count(this.props.children)
    const index = this.props.index || 0

    return [{
     key: 'track',
     style: {
       width: spring(numberOfChildren * 100),
       left: spring((index + 1) * -100 + 100, SliderSpring)
      }
    }]
  }

  private renderTrack = (interpolatedStyles: TransitionPlainStyle[]) => {
    const { width, left } = interpolatedStyles.reduce((trackStyle, transitionPlainStyle) => {
      if (transitionPlainStyle.key === 'track') {
        trackStyle.width = transitionPlainStyle.style['width']
        trackStyle.left = transitionPlainStyle.style['left']
      }

      return trackStyle
    }, { width: 0, left: 0 })

    return (
      <Track width={width} left={left}>
        {this.renderChildren()}
      </Track>
    )
  }

  private renderChildren (): JSX.Element[] {
    return Children.toArray(this.props.children).reduce((accum: ReactElement<any>[], child: ReactChild) => {
      if (React.isValidElement(child)) {
        accum.push(
          <div style={ChildContainerStyles} key={child.key}>
            {child}
          </div>
         )
      }
 
      return accum
    }, [])
  }

  render () {
    return (
      <div style={ContainerStyles}>
        <TransitionMotion styles={this.getTrackStyle()}>
          {this.renderTrack}
        </TransitionMotion>
      </div>
    )
  }
}
