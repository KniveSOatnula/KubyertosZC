import React from 'react';
import {withStyles, Typography, Grid, Button, TextField, Divider, FormControl, FormGroup, FormHelperText} from '@material-ui/core';
import  {ME, UPDATE_USER} from '../queries';
import {Query, Mutation, withApollo} from 'react-apollo';
import { withSnackbar } from 'notistack';

const styles = {
	root: {
		margin: 32
	},
	form: {
		backgroundColor: "#f2f2f2"
	}
}

class MyAccount extends React.Component {

	state = {
		enableChangeAddress: false,
		enableChangeName: false,
		enableChangePhoneNumber: false,
		id: '',
		address: '',
		firstname: '',
		lastname: ''
	}

	validate = () => {
		if(this.state.firstname === "") return "Firstname is required."
		else if(this.state.lastname === "") return "Lastname is required."
		else if(this.state.phoneNumber === "") return "Phone number is required."
		else if(this.state.phoneNumber.length !== 11) return "Invalid Phone number."
		else if(this.state.address === "") return "Address is required."
		else return ''
	}

	async componentDidMount() {
		const { client } = this.props;
		let { data: {me} } = await client.query({query: ME});
		this.setState({
			id: me.id,
			address: me.address,
			firstname: me.firstname,
			lastname: me.lastname,
			phoneNumber: me.phoneNumber,
			error: ''
		})
	}

	handleChange = name => event => {
		this.setState({
			[name]: event.target.value,
		});
	};

	render() {
		const {classes} = this.props;
		return <div className={classes.root}>
			<Typography color="secondary" variant="h4" style={{marginBottom: 32}}>
				My Account
			</Typography>
			<Divider/>
			<Grid container direction="column">
				{
					!this.state.enableChangeName  && <Grid item container xs={12} style={{padding: 8}} alignItems="center">
						<Grid item container xs={2}>
							<Typography>Name</Typography>
						</Grid>
						<Grid item container xs={8}>
						<Typography color="textSecondary">{this.state.firstname} {this.state.lastname}</Typography>
						</Grid>
						<Grid item container xs={2}>
							<Button onClick={() => this.setState({enableChangeName: true})}>Edit</Button>
						</Grid>
					</Grid>
				}
				{
					this.state.enableChangeName  && <Mutation mutation={UPDATE_USER}>
						{(updateUser, { error, loading }) => {
							return <Grid item container xs={12} style={{padding: 8}} className={classes.form}>
							<FormControl fullWidth required error={Boolean(error) || Boolean(this.state.error)} component="fieldset">
							<Typography variant="subtitle2">Name</Typography>
							<FormGroup>
							<TextField
								required
								label="Firstname"
								type="text"
								name="firstname"
								margin="normal"
								variant="outlined"
								value={this.state.firstname}
								onChange={this.handleChange('firstname')}
							/>
							<TextField
								required
								label="Lastname"
								type="text"
								margin="normal"
								variant="outlined"
								value={this.state.lastname}
								onChange={this.handleChange('lastname')}
							/>
							<Grid container spacing={16}>
								<Grid item><Button disabled={loading} variant="contained" color="secondary" onClick={async () => {
									let error = this.validate();
									if(error){
										this.setState({error})
										return;
									}
									let variables = {
										id: this.state.id,
										lastname: this.state.lastname,
										firstname: this.state.firstname
									}
									try {
										await updateUser({variables});;
										this.props.enqueueSnackbar('Successfully saved.', {variant: 'success'});
										this.setState({enableChangeName: false});
									} catch (error) {
										error.graphQLErrors.forEach(({ message }) => {
											this.props.enqueueSnackbar(message, {variant: 'error'});
										})
									}
								}}>Save</Button></Grid>
								<Grid item><Button variant="contained" onClick={() => this.setState({enableChangeName: false})}>Cancel</Button></Grid>
							</Grid>
							</FormGroup>
							<FormHelperText>
							{error && error.graphQLErrors.map(({ message }, i) => (
								<span key={i}>{message}</span>
							))}
							{this.state.error && <span>{this.state.error}</span>}
							</FormHelperText>
							</FormControl>
							</Grid>
						}}
						</Mutation>
				}
				<Divider/>
				{
					!this.state.enableChangePhoneNumber  && <Grid item container xs={12} style={{padding: 8}} alignItems="center">
						<Grid item container xs={2}>
							<Typography>Phone Number</Typography>
						</Grid>
						<Grid item container xs={8}>
						<Typography color="textSecondary">{this.state.phoneNumber}</Typography>
						</Grid>
						<Grid item container xs={2}>
							<Button onClick={() => this.setState({enableChangePhoneNumber: true})}>Edit</Button>
						</Grid>
					</Grid>
				}
				{
					this.state.enableChangePhoneNumber  && <Mutation mutation={UPDATE_USER}>
						{(updateUser, { error, loading }) => {
							return <Grid item container xs={12} style={{padding: 8}} className={classes.form}>
							<FormControl fullWidth required error={Boolean(error) || Boolean(this.state.error)} component="fieldset">
							<Typography variant="subtitle2">Name</Typography>
							<FormGroup>
							<TextField
								required
								label="Phone Number"
								type="text"
								name="phoneNumber"
								margin="normal"
								variant="outlined"
								value={this.state.phoneNumber}
								onChange={this.handleChange('phoneNumber')}
							/>
							<Grid container spacing={16}>
								<Grid item><Button disabled={loading} variant="contained" color="secondary" onClick={async () => {
									let error = this.validate();
									if(error){
										this.setState({error})
										return;
									}
									let variables = {
										id: this.state.id,
										phoneNumber: this.state.phoneNumber
									}
									try {
										await updateUser({variables});;
										this.props.enqueueSnackbar('Successfully saved.', {variant: 'success'});
										this.setState({enableChangePhoneNumber: false});
									} catch (error) {
										error.graphQLErrors.forEach(({ message }) => {
											this.props.enqueueSnackbar(message, {variant: 'error'});
										})
									}
								}}>Save</Button></Grid>
								<Grid item><Button variant="contained" onClick={() => this.setState({enableChangePhoneNumber: false})}>Cancel</Button></Grid>
							</Grid>
							</FormGroup>
							<FormHelperText>
							{error && error.graphQLErrors.map(({ message }, i) => (
								<span key={i}>{message}</span>
							))}
							{this.state.error && <span>{this.state.error}</span>}
							</FormHelperText>
							</FormControl>
							</Grid>
						}}
						</Mutation>
				}
				<Divider/>
				{
					!this.state.enableChangeAddress  && <Grid item container xs={12} style={{padding: 8}} alignItems="center">
						<Grid item container xs={2}>
							<Typography>Address</Typography>
						</Grid>
						<Grid item container xs={8}>
						<Typography color="textSecondary">{this.state.address}</Typography>
						</Grid>
						<Grid item container xs={2}>
							<Button onClick={() => this.setState({enableChangeAddress: true})}>Edit</Button>
						</Grid>
					</Grid>
				}
				{
					this.state.enableChangeAddress  && <Mutation mutation={UPDATE_USER}>
						{(updateUser, { error, loading }) => {
							return <Grid item container xs={12} style={{padding: 8}} className={classes.form}>
							<FormControl fullWidth required error={Boolean(error) || Boolean(this.state.error)} component="fieldset">
							<Typography variant="subtitle2">Name</Typography>
							<FormGroup>
							<TextField
								label="Address"
								placeholder="House No./Building Name, Street/Drive , Barangay"
								multiline
								margin="normal"
								variant="outlined"
								value={this.state.address}
								onChange={this.handleChange('address')}
							/>
							<Grid container spacing={16}>
								<Grid item><Button disabled={loading} variant="contained" color="secondary" onClick={async () => {
									let error = this.validate();
									if(error){
										this.setState({error})
										return;
									}
									let variables = {
										id: this.state.id,
										address: this.state.address
									}
									try {
										await updateUser({variables});;
										this.props.enqueueSnackbar('Successfully saved.', {variant: 'success'});
										this.setState({enableChangeAddress: false});
									} catch (error) {
										error.graphQLErrors.forEach(({ message }) => {
											this.props.enqueueSnackbar(message, {variant: 'error'});
										})
									}
								}}>Save</Button></Grid>
								<Grid item><Button variant="contained" onClick={() => this.setState({enableChangeAddress: false})}>Cancel</Button></Grid>
							</Grid>
							</FormGroup>
							<FormHelperText>
							{error && error.graphQLErrors.map(({ message }, i) => (
								<span key={i}>{message}</span>
							))}
							{this.state.error && <span>{this.state.error}</span>}
							</FormHelperText>
							</FormControl>
							</Grid>
						}}
						</Mutation>
				}
				<Divider/>
			</Grid>
		</div>
	}
}

export default withStyles(styles)(withApollo(withSnackbar(MyAccount)));