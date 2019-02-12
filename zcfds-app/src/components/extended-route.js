import React from 'react';
import {Route} from 'react-router-dom';

const ExtendedRoute = ({ component: Component, componentProps, ...rest }) => (
	<Route {...rest} render={props => (
		<Component {...props} {...componentProps}/>
	)}/>
)

export default ExtendedRoute;