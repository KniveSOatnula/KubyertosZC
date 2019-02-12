import React, { Component } from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { BrowserRouter,  Route, Switch } from "react-router-dom";
import { ApolloProvider } from "react-apollo";
import { createUploadLink } from 'apollo-upload-client';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink, Observable } from 'apollo-link';
import { SnackbarProvider } from 'notistack';
import AppBar from './components/app-bar';
import LoginForm from './components/login-form';
import SignUpForm from './components/signup-form';
import AdminPage from './components/admin-page';
import RestaurantPage from './components/restaurant-page';
import HomePage from './components/home-page';
import FindRestaurantsPage from './components/find-restaurants';
import RestaurantMenu from './components/restaurant-menu';
import ManageOrders from './components/manage-orders';
import ExtendedRoute from './components/extended-route';
import Checkout from './components/checkout-page';
import MyAccount from './components/my-account';
import MyPersonnels from './components/my-personnels';
import Map from './components/gmap';

const createTheme = (color) => {
	return createMuiTheme({
		typography: {
			useNextVariants: true,
		},
		palette: {
			type: 'light',
			primary: {
				main: color
			},
			secondary: {
				main: "#97779c"
			}
		},
		typography: {
			fontFamily: [
				'Merienda One',
				'Kaushan Script',
				'Roboto',
			].join(','),
		},
	});
} 

const cache = new InMemoryCache();

const request = (operation) => {
	const token = localStorage.getItem('token');
	if(token) {
		operation.setContext({
			headers: {
				authorization: token
			}
		});
	}
};

const requestLink = new ApolloLink((operation, forward) =>
	new Observable(observer => {
		let handle;
		Promise.resolve(operation)
		.then(oper => request(oper))
		.then(() => {
			handle = forward(operation).subscribe({
			next: observer.next.bind(observer),
			error: observer.error.bind(observer),
			complete: observer.complete.bind(observer),
			});
		})
		.catch(observer.error.bind(observer));

		return () => {
		if (handle) handle.unsubscribe();
		};
	})
);
const client = new ApolloClient({
	link: ApolloLink.from([
		requestLink,
		createUploadLink({
			uri: '/api/graphql',
		})
	]),
	cache
});

class App extends Component {

	state = {
		userType: ''
	}

	componentDidMount() {
		this.setState({userType: localStorage.getItem('userType')})
	}

	render() {
		let theme = createTheme('#673504');
		if(this.state.userType === 'ADMIN') {
			theme = createTheme('#aa2e25');
		}
		else if(this.state.userType === 'DELIVERY_PERSONNEL') {
			theme = createTheme('#357a38');
		}
		else if(this.state.userType === 'RESTAURANT') {
			theme = createTheme('#1769aa');
		}
		return (
			<SnackbarProvider maxSnack={3}>
			<ApolloProvider client={client}>
			<BrowserRouter>
			<MuiThemeProvider theme={theme}>
				<CssBaseline/>
				<div>
					<AppBar/>
					<div style={{paddingTop:64}}>
					<Switch>
						<Route  path="/" exact={true} component={HomePage} />
						<ExtendedRoute path="/login" component={LoginForm}
							componentProps={{
								setTheme: (userType) => {
									this.setState({userType});
								}							
							}}
						/>
						<Route  path="/signup" component={SignUpForm} />
						<Route  path="/admin" component={AdminPage} />
						<Route path="/restaurant" component={RestaurantPage} />
						<Route path="/find-restaurants" component={FindRestaurantsPage} />
						<ExtendedRoute path="/manageorders" component={ManageOrders}
							componentProps={{
								title: 'Manage Orders',
							}}
						/>
						<ExtendedRoute path="/myorders" component={ManageOrders}
							componentProps={{
								title: 'My Orders',
							}}
						/>
						<Route path="/checkout" component={Checkout} />
						<Route path="/myaccount" component={MyAccount}/>
						<Route path="/mypersonnels" component={MyPersonnels} />
						<Route path="/map/:id" component={Map} />
						<Route path="/map" component={Map} />
						<Route path="/menu/:id" component={RestaurantMenu} />
					</Switch></div>
				</div>
			</MuiThemeProvider>
			</BrowserRouter>
			</ApolloProvider>
			</SnackbarProvider>
		);
	}
}

export default App;
