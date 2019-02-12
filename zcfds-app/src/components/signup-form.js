import React from 'react';
import {Grid, Button, TextField, FormControl, FormHelperText, FormGroup, Paper, withStyles, Typography} from '@material-ui/core';
import { Mutation } from "react-apollo";
import { Redirect } from "react-router-dom";
import { SIGNUP } from '../queries';
import validator from 'validator';
import {withSnackbar} from 'notistack';

const styles = theme => ({
	root: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		marginTop: "64px"
	},
	paper: {
		width: '480px',
		padding: theme.spacing.unit * 2,
		textAlign: 'center',
		color: theme.palette.text.secondary
	},
	button: {
		margin: theme.spacing.unit,
	},
	info: {
		padding: 16
	}
});

class SignUpForm extends React.Component {
	state = {
		email: "",
		password:"",
		firstname:"",
		lastname:"",
		phoneNumber: "",
		error: ""
	}

	handleChange = name => event => {
		this.setState({
			[name]: event.target.value,
		});
	};
	
	validate = () => {
		if(this.state.firstname === "") return "Firstname is required."
		else if(this.state.lastname === "") return "Lastname is required."
		else if(!validator.isEmail(this.state.email)) return "Invalid email."
		else if(this.state.email === "") return "Email is required."
		else if(this.state.password === "") return "Password is required."
		else if(this.state.password.length < 6) return "Password is too short, must be atleast 6 characters."
		else if(this.state.phoneNumber === "") return "Phone number is required."
		else if(this.state.phoneNumber.length !== 11) return "Invalid phone number."
		else return ""
	}

	render() {
		const { classes } = this.props;
		return (
			<Mutation mutation={SIGNUP}>
			{(signUp, { data, error, loading }) => {
				if(data) {
					//localStorage.setItem('token', data.signup.token);
					let userType = data.signup.user.userType;
					this.props.enqueueSnackbar('Successfully account created. Please verify email to login.', {variant: 'success', autoHideDuration: 30*1000});
					if(userType === 'CLIENT') {
						return <Redirect to="/find-restaurants"/>
					}
				}	 
				return <div className={classes.root}>
				<Paper className={classes.paper}>
					<FormControl fullWidth={true} required error={Boolean(error) || Boolean(this.state.error)} component="fieldset">
					<Typography variant="h5">Create An Account</Typography>
					<Typography color="textSecondary">To find and order foods</Typography>
					<Grid spacing={16} container direction="row">
						<Grid item xs><TextField
						label="Firstname"
						type="text"
						name="firstname"
						margin="normal"
						variant="outlined"
						value={this.state.firstname}
						onChange={this.handleChange('firstname')}
					/></Grid>
						<Grid item xs><TextField
						label="Lastname"
						type="text"
						name="lastname"
						margin="normal"
						variant="outlined"
						value={this.state.lastname}
						onChange={this.handleChange('lastname')}
					/></Grid>
					</Grid>
					<FormGroup>
						<TextField
						label="Your email"
						type="email"
						name="email"
						autoComplete="email"
						margin="normal"
						variant="outlined"
						value={this.state.email}
						onChange={this.handleChange('email')}
					/>
					<TextField
						label="Your password"
						type="password"
						margin="normal"
						variant="outlined"
						value={this.state.password}
						onChange={this.handleChange('password')}
					/>
					<TextField
						label="Your phone number"
						type="text"
						name="phoneNumber"
						placeholder="09XXXXXXXXX"
						margin="normal"
						variant="outlined"
						value={this.state.phoneNumber}
						onChange={this.handleChange('phoneNumber')}
					/>
					<Button variant="contained" color="primary" disabled={loading} className={classes.button} onClick={() => {
						let error = this.validate();
						if(error) {
							this.setState({error});
							return;
						}
						signUp({variables:{
							email: this.state.email, 
							password: this.state.password,
							firstname: this.state.firstname,
							lastname: this.state.lastname,
							phoneNumber: this.state.phoneNumber
						}})
					}}>
						Sign Up
					</Button>
					<Typography className={classes.info} color="textSecondary">
					By creating an account, you are agreeing to our 
					Terms of Service and Privacy Policy
					</Typography>
					</FormGroup>
					<FormHelperText>
						{error && error.graphQLErrors.map(({ message }, i) => (
							<span key={i}>{message}</span>
						))}
						{this.state.error && <span>{this.state.error}</span>}
					</FormHelperText>
					</FormControl>
				</Paper>
				</div>
			}}
			</Mutation>
		);
	}
}

export default withStyles(styles)(withSnackbar(SignUpForm));
