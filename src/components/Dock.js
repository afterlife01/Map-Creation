import React, { Component } from 'react'
import Dock from 'react-dock'
import firebase, { db } from '../config/Fire'
import '../CSSStyle/Dock.css'

export default class DockMap extends Component {
  constructor (props) {
    super(props)
    this.logout = this.logout.bind(this)
    this.onShowClick = this.onShowClick.bind(this)
    this.state = {
      isVisible: false,
      planData: []
    }
  }

  componentDidMount () {
    // get all plan list from frirestore
    let arr = []
    db.collection('plan').get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        arr.push({
          planName: doc.data(),
          planId: doc.id
        })
      })
    })
    this.setState({
      planData: arr
    })
  }

  logout () {
    firebase.auth().signOut()
    this.setState({ user: null })
  }

  onShowClick () {
    this.setState({
      isVisible: !this.state.isVisible
    })
  }

  onListClick (planId) {
    // pass props to map and then close dock
    console.log('list click!', planId)

    this.setState({
      isVisible: !this.state.isVisible
    })
  }

  render () {
    return (
      <div>
        <button className='btn btn-info' onClick={this.onShowClick}>
          {' '}Click!{' '}
        </button>

        <Dock
          position='right'
          isVisible={this.state.isVisible}
          fluid
          dimMode='opaque'
        >

          <button
            className='btn btn-warning'
            onClick={() => this.setState({ isVisible: !this.state.isVisible })}
          >
            X
          </button>
          <ul>

            {/* add all list to dock */}
            {this.state.planData.map(value => {
              return (
                <li
                  className='li'
                  key={value['planId']}
                  onClick={() => this.onListClick(value['planId'])}
                >
                  {value['planName']['planName']}
                </li>
              )
            })}
          </ul>

          <button className='btn btn-submit' onClick={this.logout}>
            Logout
          </button>
        </Dock>
      </div>
    )
  }
}
