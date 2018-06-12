import React, { Component } from 'react';
import firebase from './config/Fire';
import {provider,auth} from './config/Fire';

const loginStyles = {
    width: "90%",
    maxWidth: "500px",
    margin: "20px auto",
    border: "1px solid #ddd",
    borderRadius : "5px",
    padding: "10px"
}

class Login extends Component {
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.signup = this.signup.bind(this);
    
    this.state = {
      email: '',
      password: ''
    };
  }

  

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  

  login(e) {
    e.preventDefault();
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((u)=>{
    }).catch((error) => {
        console.log(error);
      });
  }

  signup(e){
    e.preventDefault();
    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
    .catch((error) => {
        console.log(error);
      })
  }

  async loginF() {
    const result = await auth().signInWithPopup(provider)
    this.setState({user: result.user});
  }



  render() {
    return (
      
        <div style={loginStyles}>
            
          <form>
              
            <div class="form-group"><br/>
                
                <label for="exampleInputEmail1">Email address</label>
                <input  value={this.state.email} onChange={this.handleChange} type="email" name="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" /><br/><br/><br/>
            </div>
            <div class="form-group">
              <label for="exampleInputPassword1">Password</label>
              <input  value={this.state.password} onChange={this.handleChange} type="password" name="password" class="form-control" id="exampleInputPassword1" placeholder="Password" />
            </div><br/><br/><br/>
            <button type="submit" onClick={this.login} className="btn btn-primary">Login</button>
            <button onClick={this.signup} style={{marginLeft: '25px'}} className="btn btn-success">Signup</button><br/><br/><br/>
            
            
          </form>
          <div>
            <button onClick={this.loginF.bind(this)} className="btn btn-primary">Login with Facebook</button>
            </div>
        </div>
        
      );
    }
  }
  export default Login;
