import React, { Component } from 'react';
import firebase from './config/Fire';
import Login from './Login';
import Home from './Home';
import './App.css';
import Dock from './components/Dock';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: null,
    }
  }

  componentDidMount() {
    this.authListener();
  }

  authListener() {
    firebase.auth().onAuthStateChanged((user) => {

      if (user) {
        this.setState({ user });

      }
      else {
        this.setState({ user: null });

      }
    });
  }

  render() {

    return (
      <div className="App">
        {this.state.user ? (<Home />) : (<Login />)}
      </div>
    );
  }
}

export default App;
