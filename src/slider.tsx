import * as React from 'react'
// import ReactDOM from "react-dom";

import {
  TransitionMotion,
  spring,
  TransitionStyle,
  TransitionPlainStyle,
  SpringHelperConfig,
  OpaqueConfig
} from 'react-motion'

/*
  <Container>
    <Track>
      [<ChildContainer>{child}</ChildContainer>]
    </Track>
  </Container>
*/

const ContainerStyles = {
  position: 'relative',
  height: '100%',
  width: '100%',
  overflowX: 'hidden'
}

const TrackStyle = {
  display: 'flex',
  position: 'relative',
  flexDirection: 'row',
  height: '100%',
  overflowY: 'visible'
}

const ChildContainerStyles = {
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
}

const SliderSpring: SpringHelperConfig = {
  stiffness: 291,
  damping: 29
}

interface TrackProps {
  width: number,
  left: number,
  children?: any
}

function Track ({ width, left, children }: TrackProps): React.ReactElement<any> {
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

export class Slider extends React.Component<SliderProps, any> {
  
  static propTypes = {
    index: React.PropTypes.number.isRequired,
    children: React.PropTypes.arrayOf(React.PropTypes.element)
  }
  
  private getTrackStyle = (): TransitionStyle[] => {
    const numberOfChildren = React.Children.count(this.props.children)
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
    return React.Children.toArray(this.props.children).reduce((accum: React.ReactElement<any>[], child: React.ReactChild) => {
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
