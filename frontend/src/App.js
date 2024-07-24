import React, {Component} from 'react'

import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import Overview from './subcomponents/main/Overview'
import TransferPage from './subcomponents/main/Transfer'
import Authentication from './subcomponents/authentication/Authentication'
import './App.css';

const BACKEND_URL = 'https://bank-backend-877cac89bc1f.herokuapp.com/'

const initialTxDetails = {
  txToAccount: '',
  txAmount: 0,
  txCurrency: ''
}

const initialLoginDetails = {
  email: '',
  username: '',
  password: ''
}

const initialAcctDetails = {
  username: '',
  accountNumber: '',
  balance: 0
}

const initialTxTable = {
  exists: false,
  txs: [],
  page: 0
}

const initialState = {
  route: 'login',
  loginDetails: initialLoginDetails,
  acctDetails: initialAcctDetails,
  txDetails: initialTxDetails,
  txTable: initialTxTable
}

class App extends Component {

  constructor() {
    super()
    this.state = initialState
  }
  
  onRouteChange = (dest) => {
    this.setState({
      route: dest
    })
  }

  onFormTextChange = (object, key, value) => {
    this.setState({
      [object]: {
        ...this.state[object],
        [key]: value
      }
    })
  }

  sendTransaction = async () => {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.state.loginDetails.username,
        txDetails: this.state.txDetails
      })
    }
    let response = await (await fetch(BACKEND_URL + 'send_transaction', requestOptions)).json()
    let message = response['message']
    alert(message)
  }

  onAuthentication = async (route) => {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        loginDetails: this.state.loginDetails
      })
    }
    let response = await (
      await fetch(
      BACKEND_URL + route, requestOptions
      )
    ).json()
    let {success, message, result} = response
    alert(message)
    if (success) {
      this.setState({
        ...this.state,
        route: 'overview',
        acctDetails: result['account_details'],
        txTable: result['tx_table']
      })
    }
  }

  getOverviewRoute = async () => {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        loginDetails: this.state.loginDetails
      })
    }
    let response = await (
      await fetch(
        BACKEND_URL + 'get_overview_route', requestOptions
      )
    ).json()
    let {success, result} = response
    if (success) {
      this.setState({
        ...this.state,
        route: 'overview',
        acctDetails: result['account_details'],
        txTable: result['tx_table']
      })
    }
  }

  onNavigatePagination = (value) => {
    let page = this.state.txTable.page
    if (value === 'Next') {
      this.setState({
        txTable: {
          ...this.state.txTable,
          page: page + 1
        }
      })
     } else {
      this.setState({
        txTable: {
          ...this.state.txTable,
          page: page - 1
        }
      })
    }
  }

  render() {
    return (
      <div className = "app">
        {this.state.route === 'overview'
        ?
          <Overview
          state = {this.state}
          onRouteChange = {this.onRouteChange}
          getOverviewRoute = {this.getOverviewRoute}
          onNavigatePagination = {this.onNavigatePagination}
          />
        : this.state.route === 'transfer'
        ?
          <TransferPage
          onRouteChange = {this.onRouteChange}
          sendTransaction = {this.sendTransaction}
          onFormTextChange = {this.onFormTextChange}
          getOverviewRoute = {this.getOverviewRoute}
          />
        : this.state.route === 'login' || this.state.route === 'register'
        ? 
          <Authentication
          state = {this.state}
          onRouteChange = {this.onRouteChange}
          onFormTextChange = {this.onFormTextChange}
          onAuthentication = {this.onAuthentication}
          />
        :
          <></>
        }
      </div>
    )
  }
}

export default App;
