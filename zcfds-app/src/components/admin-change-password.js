import React from 'react';
import {withRouter} from 'react-router-dom';
import {Button, Dialog, DialogActions, DialogContent, FormControl, InputLabel, Input, InputAdornment, DialogTitle, IconButton, FormHelperText} from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import {UPDATE_USER} from '../queries';
import {Mutation} from 'react-apollo';

class AdminChangePassword extends React.Component {

	state = {
		id: '',
		password: '',
		showPassword: false,
		error: ''
	};

	async componentDidMount() {
		const { match } = this.props;
		this.setState({
			id: match.params.id
		})
	}

	handleChange = prop => event => {
		this.setState({ [prop]: event.target.value });
	};
	
	handleClickShowPassword = () => {
		this.setState(state => ({ showPassword: !state.showPassword }));
	};

	validate = () => {
		if(this.state.password === "") return "Password is required."
		else if(this.state.password.length < 6) return "Password is too short, must be atleast 6 characters."
		else return ""
	}

	render() {
		const {history} = this.props;
		return (<Mutation mutation={UPDATE_USER}>
			{(updateUser, { data, error, loading }) => {
				if(data) {
					history.goBack();
				}
				return <Dialog
					open={true}
					aria-labelledby="form-dialog-title"
					>
					<DialogTitle id="form-dialog-title">Change Password</DialogTitle>
					<DialogContent>
					<FormControl error={Boolean(error)|| Boolean(this.state.error)}>
					<InputLabel htmlFor="adornment-password">Password</InputLabel>
					<Input
						id="adornment-password"
						type={this.state.showPassword ? 'text' : 'password'}
						value={this.state.password}
						onChange={this.handleChange('password')}
						endAdornment={
						<InputAdornment position="end">
							<IconButton
							aria-label="Toggle password visibility"
							onClick={this.handleClickShowPassword}
							>
							{this.state.showPassword ? <Visibility /> : <VisibilityOff />}
							</IconButton>
						</InputAdornment>
						}
					/>
					<FormHelperText>
						{error && error.graphQLErrors.map(({ message }, i) => (
							<span key={i}>{message}</span>
						))}
						{this.state.error && <span>{this.state.error}</span>}
					</FormHelperText>
					</FormControl>
					</DialogContent>
					<DialogActions>
					<Button onClick={() => history.goBack()} color="primary">
						Cancel
					</Button>
					<Button disabled={loading} onClick={() => {
						let error = this.validate();
						if(error) {
							this.setState({error});
							return;
						}
						let variables = {
							id: this.state.id,
							password: this.state.password
						}
						updateUser({variables})
					}} color="primary">
						Update
					</Button>
					</DialogActions>
				</Dialog>
			}}
		</Mutation>
		)
	}
}

export default withRouter(AdminChangePassword);