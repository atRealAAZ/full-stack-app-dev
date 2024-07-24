import {Component} from 'react'
import {Card, Form, Button} from 'react-bootstrap'

import './Authentication.css'

class Authentication extends Component {
    render() {
        return (
            <>
            {this.props.state.route === 'login'
            ?   
                <Login
                onRouteChange = {this.props.onRouteChange}
                onFormTextChange = {this.props.onFormTextChange}
                onAuthentication = {this.props.onAuthentication}
                />
            :
                <Register
                onRouteChange = {this.props.onRouteChange}
                onFormTextChange = {this.props.onFormTextChange}
                onAuthentication = {this.props.onAuthentication}
                />
            }
            </>
        )
    }
}

class Login extends Component {
    render() {
        return (
            <>
                <Card className = "auth">
                    <Card.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type ="username"
                        onChange = {
                            (event) => {
                                this.props.onFormTextChange(
                                    'loginDetails', 'username', event.target.value
                                )
                            }
                        }
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type ="password"
                        onChange = {
                            (event) => {
                                this.props.onFormTextChange(
                                    'loginDetails', 'password', event.target.value
                                )
                            }
                        }
                        />
                    </Form.Group>
                    <Button
                        onClick = {() => this.props.onAuthentication('login')}
                        >Login
                    </Button>
                    <Button
                        onClick = {() => {this.props.onRouteChange('register')}}
                        >Register
                    </Button>
                    </Card.Body>
                </Card>
            </>
        )
    }
}

class Register extends Component {
    render() {
        return (
            <>
                <Card className = "auth">
                    <Card.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type ="email"
                        onChange = {
                            (event) => {
                                this.props.onFormTextChange(
                                    'loginDetails', 'email', event.target.value
                                )
                            }
                        }/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type ="username"
                        onChange = {
                            (event) => {
                                this.props.onFormTextChange(
                                    'loginDetails', 'username', event.target.value
                                )
                            }
                        }/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type ="password"
                        onChange = {
                            (event) => {
                                this.props.onFormTextChange(
                                    'loginDetails', 'password', event.target.value
                                )
                            }
                        }
                        />
                    </Form.Group>
                    <Button
                        onClick = {() => {this.props.onRouteChange('login')}}
                        >To Login
                    </Button>
                    <Button
                    onClick = {() => this.props.onAuthentication('register')}
                    >
                        Create
                    </Button>
                    </Card.Body>
                </Card>
            </>
        )
    }
}

export default Authentication