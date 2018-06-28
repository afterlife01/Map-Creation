import React from "react";
import Popup from "reactjs-popup";
import { Form, Text } from 'react-form';
import { db } from "../config/Fire";

export default class Modal extends React.Component {
    constructor(props) {

        super(props);
        this.onSaveToFireStore = this.onSaveToFireStore.bind(this)
        this.state = {
            inputValue: ''
        }
    }
    onSaveToFireStore() {
        var planName = this.state.inputValue
        if (planName === '') {
            alert("กรุณากรอกชื่อแปลง")
        } else {
            db.collection("plan")
                .add({
                    //add data here
                    planName
                })
                .then(function () {
                    alert("Document successfully written!")
                })
                .catch(function (error) {
                    console.error("Error writing document: ", error);
                });
        }
    }
    updateInputValue(evt) {
        this.setState({
            inputValue: evt.target.value
        });

    }


    render() {
        return (
            <Popup
                trigger={<button className="btn btn-info"> Create plan </button>}
                modal
                closeOnDocumentClick>
                <Form>
                    <div>
                        <input value={this.state.inputValue} onChange={evt => this.updateInputValue(evt)} />
                        <button type="submit" className="btn btn-primary" onClick={this.onSaveToFireStore}>Submit</button>
                    </div>
                </Form>
            </Popup>

        );
    }
}
