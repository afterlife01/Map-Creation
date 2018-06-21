import React from 'react'
import ReactDOM from 'react-dom'

// Enables custom elements within <GoogleMap>
// Children shouldn't change height between renders
export const MapControl = React.createClass({
  componentDidMount() { this._render() },
  componentDidUpdate() { this._render() },
  componentWillUnmount() {
    const {mapHolderRef, controlPosition} = this.props
    const index = mapHolderRef.getMap().controls[controlPosition].getArray().indexOf(this.el)
    mapHolderRef.getMap().controls[controlPosition].removeAt(index)
  },
  _render() {
    const {mapHolderRef, controlPosition, children} = this.props
    ReactDOM.render(
      <div
        ref={el => {
          const controlSet = mapHolderRef.getMap().controls[controlPosition]
          if (!this.renderedOnce) {
            this.el = el
            controlSet.push(el)
          } else if (el && this.el && el !== this.el) {
            this.el.innerHTML = '';
            [].slice.call(el.childNodes).forEach(child => this.el.appendChild(child))
          }
          this.renderedOnce = true
        }}
      >
        {children}
      </div>,
      document.createElement('div')
    )
  },
  render() {
    return <noscript />
  },
})

export default MapControl
