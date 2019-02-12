import React from 'react';
import {Button, TextField, FormControl, FormHelperText, FormGroup, Paper, Typography, withStyles} from '@material-ui/core';
import { Mutation } from "react-apollo";
import { Redirect } from "react-router-dom";
import {LOGIN} from '../queries'
import banner from '../images/table.jpg';

const styles = theme => ({
	root: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
		top: 0,
		paddingTop: 64,
		backgroundImage: `url("${banner}")`,
		backgroundSize: 'cover'
	},
	paper: {
		width: '480px',
		padding: theme.spacing.unit * 2,
		textAlign: 'center',
		color: theme.palette.text.secondary,
		transform: 'translate(-50%, -50%)',
		position: 'absolute',
		left: '50%',
		top: '50%',
	},
	button: {
		margin: theme.spacing.unit,
	},
});

class LoginForm extends React.Component {
	state = {
		email: "",
		password:""
	}

	handleChange = name => event => {
		this.setState({
			[name]: event.target.value,
		});
	};
	
	render() {
		const { classes, setTheme } = this.props;
		console.log(this.props)
		return (
			<Mutation mutation={LOGIN}>
			{(login, { data, error, loading }) => {	
				if(data) {
					localStorage.setItem('token', data.login.token);
					localStorage.setItem('userType', data.login.user.userType);
					let userType = data.login.user.userType;
					setTheme(userType);
					if(userType === 'CLIENT') {
						return <Redirect to="/find-restaurants"/>
					}
					else if(userType === 'RESTAURANT') {
						return <Redirect to="/restaurant/managemenuitems"/>
					}
					else if(userType === 'DELIVERY_PERSONNEL') {
						return <Redirect to="/manageorders"/>
					}
					else if(userType === 'ADMIN') {
						return <Redirect to="/admin/managerestaurants"/>
					}
				}
				return <div className={classes.root}>
				<Paper className={classes.paper}>
					<FormControl fullWidth={true} required error={Boolean(error)} component="fieldset">
					<Typography color="primary" variant="h4">Welcome Back</Typography>
					<FormGroup>
					<TextField
						label="Email"
						type="email"
						name="email"
						autoComplete="email"
						margin="normal"
						variant="outlined"
						value={this.state.email}
						onChange={this.handleChange('email')}
					/>
					<TextField
						label="Password"
						type="password"
						autoComplete="current-password"
						margin="normal"
						variant="outlined"
						value={this.state.password}
						onChange={this.handleChange('password')}
					/>
					<Button disabled={loading} variant="contained" color="secondary" className={classes.button} onClick={() => {
						login({variables:{email: this.state.email, password: this.state.password}})
					}}>
						Login
					</Button>
					</FormGroup>
					<FormHelperText>
						{error && error.graphQLErrors.map(({ message }, i) => (
							<span key={i}>{message}</span>
						))}
					</FormHelperText>
					</FormControl>
				</Paper>
				</div>
			}}
			</Mutation>
		);
	}
}

export default withStyles(styles)(LoginForm);
