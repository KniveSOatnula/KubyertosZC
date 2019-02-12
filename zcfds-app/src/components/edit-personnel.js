import React from 'react'
import { Mutation, withApollo } from "react-apollo";
import {withStyles, FormControl, FormHelperText, FormGroup, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle,
	InputLabel, Select, Input, MenuItem, Checkbox, ListItemText
} from '@material-ui/core';
import {withRouter} from 'react-router-dom';
import {UPDATE_USER, GET_DELIVERY_PERSONNEL, RESTAURANTS, SINGLE_UPLOAD} from '../queries'
import CroppingDialog from './cropping';
import validator from 'validator';

const styles = {
	preview: {
		width: 300,
		height: 300
	}
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
};


class UpdatePersonnel extends React.Component {
	
	state = {
		id: "",
		email: "",
		firstname: "",
		lastname: "",
		phoneNumber: "",
		plateNumber: "",
		src: null,
		open: false,
		file: null,
		error: '',
		restaurants: [],
		selectedRestaurants: []
	}

	async componentDidMount() {
		const { client, match } = this.props;
		let { data: {deliveryPersonnel} } = await client.query({query: GET_DELIVERY_PERSONNEL, variables: {id: match.params.id}});
		let { data: {restaurants} } = await client.query({query: RESTAURANTS});
		this.setState({
			id: deliveryPersonnel.id,
			email: deliveryPersonnel.email,
			firstname: deliveryPersonnel.firstname,
			lastname: deliveryPersonnel.lastname,
			phoneNumber: deliveryPersonnel.phoneNumber,
			plateNumber: deliveryPersonnel.plateNumber,
			src: deliveryPersonnel.profilePicture ? deliveryPersonnel.profilePicture.url : null,
			selectedRestaurants: deliveryPersonnel.assignRestaurants.map(o => o.id),
			restaurants
		})
	}

	handleChange = name => event => {
		this.setState({
			[name]: event.target.value,
		});
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
		if(this.state.email === "") return "Email is required."
		else if(!validator.isEmail(this.state.email)) return "Invalid email."
		else if(this.state.firstname === "") return "Firstname is required."
		else if(this.state.lastname === "") return "Lastname is required."
		else if(this.state.phoneNumber === "") return "Phone number is required."
		else if(this.state.plateNumber === "")	return "Plate number is required."
		else if(this.state.phoneNumber.length !== 11) return "Invalid Phone number."
		else if(this.state.selectedRestaurants.length < 1) return "Must assign atleast 1 restaurant."
		else return ''
	}

	render() {
		const {history, classes, client} = this.props;
		return (
			<Mutation mutation={UPDATE_USER}>
			{(updateDeliveryPersonnel, { data, error, loading }) => {
				if(data) {
					history.goBack();
				}
				return <div><Dialog
				open={true}
				aria-labelledby="form-dialog-title">
				<DialogTitle id="form-dialog-title">Update Delivery Personnel Account</DialogTitle>
				<DialogContent>
				<FormControl fullWidth required error={Boolean(error) || Boolean(this.state.error)} component="fieldset">
					<FormGroup>
					<input type="file" accept="image/*" onChange={this.loadFile}/>
					<img alt="" src={this.state.src} className={classes.preview} />
					<TextField
						required
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
					<TextField
						required
						label="Plate Number"
						type="text"
						name="plateNumber"
						margin="normal"
						variant="outlined"
						value={this.state.plateNumber}
						onChange={this.handleChange('plateNumber')}
					/>
					<FormControl>
					<InputLabel htmlFor="select-multiple-checkbox">Assigned Restaurants</InputLabel>
					<Select
						multiple
						value={this.state.selectedRestaurants}
						onChange={this.handleChange('selectedRestaurants')}
						input={<Input id="select-multiple-checkbox" />}
						renderValue={selected => {
							console.log({selected, h: this.state.selectedRestaurants})
							return this.state.restaurants.filter(o => selected.includes(o.id)).map(o => o.restaurant.name).join(', ');
						}}
						MenuProps={MenuProps}
					>
						{this.state.restaurants.map(o => (
							<MenuItem key={o.id} value={o.id}>
								<Checkbox checked={this.state.selectedRestaurants.find((id) => id === o.id)} />
								<ListItemText primary={o.restaurant.name} />
							</MenuItem>
						))}
					</Select>
					</FormControl>
					</FormGroup>
					<FormHelperText>
						{error && error.graphQLErrors.map(({ message }, i) => (
							<span key={i}>{message}</span>
						))}
						{this.state.error && <span>{this.state.error}</span>}
					</FormHelperText>
					</FormControl>
				</DialogContent>
				<DialogActions>
					<Button  color="primary" onClick={() => {
						history.goBack();
					}}>
						Cancel
					</Button>
				<Button color="primary" disabled={loading} onClick={async () => {
					let error = this.validate();
					if(error){
						this.setState({error})
						return;
					}
					let variables = {
						id: this.state.id,
						email: this.state.email,
						lastname: this.state.lastname,
						firstname: this.state.firstname,
						plateNumber: this.state.plateNumber,
						phoneNumber: this.state.phoneNumber,
						assignRestaurants: this.state.selectedRestaurants,
					}
					if(this.state.file) {
						let result = await client.mutate({mutation: SINGLE_UPLOAD, variables:{file: this.state.file}});
						variables.profilePicture = result.data.singleUpload.id
					}
					updateDeliveryPersonnel({variables});
					}}>Update</Button>
				</DialogActions>
				</Dialog>
				{ this.state.open && <CroppingDialog src={this.state.src} file={this.state.file} handleClose={this.handleClose} />}
				</div>
			}}
			</Mutation>
		)
	}
}

export default withStyles(styles)(withApollo(withRouter(UpdatePersonnel)));