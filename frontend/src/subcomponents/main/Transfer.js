import {Component} from 'react'
import {Card, Form, Button} from 'react-bootstrap'

import Navigation from './../navigation/Navigation'

class TransferPage extends Component {
    render() {
        return (
            <>
                <Navigation
                onRouteChange = {this.props.onRouteChange}
                getOverviewRoute = {this.props.getOverviewRoute}
                />
                <Card>
                    <Card.Body>
                        <TransferForm
                        onFormTextChange = {this.props.onFormTextChange}
                        />
                        <Button
                        onClick = {this.props.sendTransaction}
                        >Transfer</Button>
                    </Card.Body>
                </Card>
            </>
        )
    }
}

class TransferForm extends Component {
    render() {
        return (
            <>
                <Card>
                    <Card.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>To Account</Form.Label>
                            <Form.Control
                            onChange = {
                                (event) => {
                                    this.props.onFormTextChange('txDetails', 'txToAccount', event.target.value)
                                }
                            }
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Amount</Form.Label>
                            <Form.Control
                            onChange = {
                                (event) => {
                                    this.props.onFormTextChange('txDetails', 'txAmount', event.target.value)
                                }
                            }
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Currency</Form.Label>
                            <Form.Control
                            onChange = {
                                (event) => {
                                    this.props.onFormTextChange('txDetails', 'txCurrency', event.target.value)
                                }
                            }
                            />
                        </Form.Group>
                    </Card.Body>
                </Card>
            </>
        )
    }
}

export default TransferPage