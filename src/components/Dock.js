import React, { Component } from 'react';
import Dock from 'react-dock'
import { db } from "../config/Fire";

export default class DockMap extends Component {


    constructor(props) {
        super(props);

        this.onShowClick = this.onShowClick.bind(this);

        this.state = {
            isVisible: false,
            planName: [],
        };
    }

    componentDidMount() {
        let arr = [];
        db.collection("plan")
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    arr.push(doc.data());
                });
            });
        this.setState({
            planName: arr
        })

    }

    onShowClick() {
        this.setState({
            isVisible: !this.state.isVisible
        });
    }

    render() {
        return (
            <div>
                <button className="btn btn-info" onClick={this.onShowClick}> Click! </button>

                <Dock position='right' isVisible={this.state.isVisible}
                    fluid={true} dimMode='opaque'>

                    <button className="btn btn-warning" onClick={() => this.setState({ isVisible: !this.state.isVisible })}>X</button>
                    <ul>

                        {this.state.planName.map(value => {
                            return (
                                <li>{value.planName}</li>
                            );
                        })}

                    </ul>
                </Dock>
            </div>
        );
    }
}