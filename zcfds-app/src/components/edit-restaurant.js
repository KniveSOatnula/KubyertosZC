import React from 'react'
import { Mutation, withApollo } from "react-apollo";
import {withStyles, Button, Dialog, Typography, IconButton, Slide, AppBar, Toolbar} from '@material-ui/core';
import {withRouter} from 'react-router-dom';
import { UPDATE_USER, SINGLE_UPLOAD, GET_USER } from '../queries'
import Stepper from "./stepper";
import CloseIcon from '@material-ui/icons/Close';
import {AccountForm, RestaurantForm} from './forms'
import validator from "validator";

const styles = {
	appBar: {
	  position: 'relative',
	},
	flex: {
	  flex: 1,
	},
}

function Transition(props) {
	return <Slide direction="up" {...props} />;
}

class EditRestaurant extends React.Component {
	
	state = {
		id: "",
		email: "",
		password:"",
		firstname: "",
		lastname: "",
		phoneNumber: "",
		address: "",
		src: null,
		open: false,
		file: null,
		sun: false,
		mon: false,
		tue: false,
		wed: false,
		thu: false,
		fri: false,
		sat: false,
		startTime: "08:00",
		endTime: "17:00",
		name: "",
		telephoneNumber: "",
		description: "",
		error: ""
	}

	async componentDidMount() {
		const { client, match } = this.props;
		let { data: {user} } = await client.query({query: GET_USER, variables: {id: match.params.id}});
		console.log({user})
		this.setState({
			id: user.id,
			email: user.email,
			firstname: user.firstname,
			lastname: user.lastname,
			phoneNumber: user.phoneNumber,
			address: user.address,
			src: user.profilePicture ? user.profilePicture.url : null,
			name: user.restaurant.name,
			description: user.restaurant.description,
			telephoneNumber: user.restaurant.telephoneNumber,
			startTime: user.restaurant.startTime,
			endTime: user.restaurant.endTime,
			sun: user.restaurant.dayOfWeeks.includes('Sun'),
			mon: user.restaurant.dayOfWeeks.includes('Mon'),
			tue: user.restaurant.dayOfWeeks.includes('Tue'),
			wed: user.restaurant.dayOfWeeks.includes('Wed'),
			thu: user.restaurant.dayOfWeeks.includes('Thu'),
			fri: user.restaurant.dayOfWeeks.includes('Fri'),
			sat: user.restaurant.dayOfWeeks.includes('Sat')
		})
	}

	handleChange = name => event => {
		this.setState({
			[name]: event.target.value,
		});
	};

	handleCheckChange = name => event => {
		this.setState({ [name]: event.target.checked });
	};
	
	loadFile = event => {
		let file = event.target.files[0]
		let src = URL.createObjectURL(file);
		this.setState({src, file, open: true});
	}

	handleClose = value => {
		let src = URL.createObjectURL(value);
		this.setState({ file: value, open: false, src });
	};

	validate = () => {
		if(this.state.firstname === "") return "Firstname is required."
		else if(this.state.lastname === "") return "Lastname is required."
		else if(!validator.isEmail(this.state.email)) return "Invalid email."
		else if(this.state.email === "") return "Email is required."
		else if(this.state.address === "") return "Address is required."
		else if(this.state.name === "") return "Name is required."
		else if(this.state.telephoneNumber === "") return "Telephone Number is required."
		else if(this.state.description === "") return "Description is required"
		else return ""
	}

	render () {
		const {classes, history, client} = this.props;
		return (
			<Mutation mutation={UPDATE_USER}>
			{(updateRestaurant, { data, error, loading }) => {
			if(data) {
				history.goBack();
			}
			let errorMessage = "";
			if(this.state.error) {
				errorMessage = this.state.error
			}
			else if(error) {
				errorMessage = error.graphQLErrors[0].message;
			}
			return (<Dialog
				fullScreen
				open={true}
				TransitionComponent={Transition}>
				<AppBar className={classes.appBar}>
				<Toolbar>
					<IconButton color="inherit" onClick={() => history.goBack()} aria-label="Close">
					<CloseIcon />
					</IconButton>
					<Typography variant="h6" color="inherit" className={classes.flex}>
						Update Restaurant Account
					</Typography>
					<Button color="inherit" onClick={async () => {
						let error = this.validate();
						if(error) {
							this.setState({error});
							return;
						}
						let dayOfWeeks = []
						if(this.state.sun) {
							dayOfWeeks.push('Sun')
						}
						if(this.state.mon) {
							dayOfWeeks.push('Mon')
						}
						if(this.state.tue) {
							dayOfWeeks.push('Tue')
						}
						if(this.state.wed) {
							dayOfWeeks.push('Wed')
						}
						if(this.state.thu) {
							dayOfWeeks.push('Thu')
						}
						if(this.state.fri) {
							dayOfWeeks.push('Fri')
						}
						if(this.state.sat) {
							dayOfWeeks.push('Sat')
						}
						let variables = {
							id: this.state.id,
							email: this.state.email,
							lastname: this.state.lastname,
							firstname: this.state.firstname,
							address: this.state.address,
							restaurant: {
								name: this.state.name,
								telephoneNumber: this.state.telephoneNumber,
								description: this.state.description,
								startTime: this.state.startTime,
								endTime: this.state.endTime,
								dayOfWeeks
							}
						}
						if(this.state.file) {
							let result = await client.mutate({mutation: SINGLE_UPLOAD, variables:{file: this.state.file}});
							variables.profilePicture = result.data.singleUpload.id
						}
						updateRestaurant({variables})
					}}>Save
					</Button>
				</Toolbar>
				</AppBar>
				<div style={{margin: 16}}>
					<Stepper steps={[
						<AccountForm error={errorMessage} hidePasswoedField={true} data={{...this.state}} handleChange={this.handleChange} loadFile={this.loadFile} handleClose={this.handleClose}/>,
						<RestaurantForm error={errorMessage} data={{...this.state}} handleChange={this.handleChange} handleCheckChange={this.handleCheckChange}/>
					]} />
				</div>
			</Dialog>)
			}}
			</Mutation>
		)
	}
}

export default withStyles(styles)(withRouter(withApollo(EditRestaurant)));