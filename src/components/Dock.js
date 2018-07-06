import React, { Component } from 'react'
import Dock from 'react-dock'
import firebase, { db } from '../config/Fire'
import '../CSSStyle/Dock.css'

export default class DockMap extends Component {
  constructor(props) {
    super(props)
    this.logout = this.logout.bind(this)
    this.onShowClick = this.onShowClick.bind(this)
    this.onListClick = this.onListClick.bind(this)

    this.state = {
      isVisible: false,
      planData: [],
    }
  }

  componentDidMount() {
    // get all plan list from frirestore filter by user ID
    let arr = []
    db.collection('plan').get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        arr.push({
          planName: doc.data() + doc.id,
        })
      })
    })
    // this.setState({
    //   planData: arr
    // })
    console.log(arr,'adsf')
  }

  logout() {
    firebase.auth().signOut()
    this.setState({ user: null })
  }

  onShowClick() {
    this.setState({
      isVisible: !this.state.isVisible
    })
  }

  onListClick(planData) {
    // pass props planIdForMap to map and then close dock

 
    this.props.onOverlayQuery(planData)

    this.setState({
      isVisible: !this.state.isVisible
    })
  }

  render() {
    return (
      <div>
        <button className='btn btn-info' onClick={this.onShowClick}>
          {' '}Click!{' '}
        </button>

        <Dock
          position='right'
          isVisible={this.state.isVisible}
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
                  onClick={() => this.onListClick(value)}
                >
                  {value['planName']['planName']}
                </li>
              )
            })}
          </ul>

          <button className='btn btn-success' onClick={this.logout}>
            Logout
          </button>
        </Dock>
      </div>
    )
  }
}
