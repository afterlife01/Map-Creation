import React, { Component } from 'react';
import Dock from 'react-dock'

export default class DockMap extends Component {

    constructor(props) {
        super(props);

        this.onShowClick = this.onShowClick.bind(this);
        this.onButtonClick = this.onButtonClick.bind(this)

        this.state = {
            isVisible: false,
            count: 0
        };
    }

    onShowClick() {
        this.setState({
            isVisible: !this.state.isVisible
        });
    }

    onButtonClick() {
        var t = this.state.count + 1
        this.setState({
            count: t
        })
    }

    render() {
        return (
            <div>
                <button className="btn btn-info" onClick={this.onShowClick}> Click! </button>

                <Dock position='right' isVisible={this.state.isVisible}
                    fluid={true} dimMode='opaque' dimStyle={{
                        position: 'fixed',
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        background: 'rgba(1, 0, 0, 0.2)',
                        opacity: 3  
                    }}
                    dockStyle={{
                        zIndex: 10
                    }}
                >
                    <button onClick={this.onButtonClick}>Click me! {this.state.count}</button>
                    <div onClick={() => this.setState({ isVisible: !this.state.isVisible })}>X</div>
                </Dock>
            </div >
        );
    }
}