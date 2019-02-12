import React from 'react'
import { Mutation, withApollo } from "react-apollo";
import {withStyles, FormControl, FormHelperText, FormGroup, TextField, Button, InputLabel, Select, Input, MenuItem, Checkbox, ListItemText,
	Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Switch} from '@material-ui/core';
import {withRouter} from 'react-router-dom';
import { CREATE_MENU_ITEM, MENU_ITEMS, SINGLE_UPLOAD, CATEGORIES} from '../queries'
import CroppingDialog from './cropping';

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


class AddMenuItem extends React.Component {
	
	state = {
		name: "",
		price: 0,
		description: "",
		hasSpecialInstruction: false,
		selectedCategories: [],
		categories: [],
		available: true,
		src: null,
		open: false,
		file: null,
		error: ''
	}

	async componentDidMount() {
		const { client } = this.props;
		let { data: {categories} } = await client.query({query: CATEGORIES});
		this.setState({categories});
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
		if(this.state.name === "") return 'Name is required.'
		else if(this.state.price <= 0) return 'Price must be greater than 0.'
		else if(this.state.description === "") return 'Description is required.'
		else if(this.state.selectedCategories.length <= 0) return 'Please select atleast 1 category.'
		else if(this.state.file === null) return 'Thumbnail is required.'
	}

	render() {
		const {history, classes, client} = this.props;
		return (
			<Mutation mutation={CREATE_MENU_ITEM} 
				update={(cache, { data: { createMenuItem } }) => {
					const { menuItems } = cache.readQuery({ query: MENU_ITEMS });
					cache.writeQuery({
						query: MENU_ITEMS,
						data: { menuItems: menuItems.concat([createMenuItem]) }
					});
				}}
			>
			{(createMenuItem, { data, error, loading }) => {
				if(data) {
					history.goBack();
				}
				return <div><Dialog
				open={true}
				aria-labelledby="form-dialog-title"
			>
				<DialogTitle id="form-dialog-title">Create Menu Item</DialogTitle>
				<DialogContent>
				<FormControl fullWidth required error={Boolean(error) || Boolean(this.state.error)} component="fieldset">
					<FormGroup>
					<input type="file" accept="image/*" onChange={this.loadFile}/>
					<img alt="" src={this.state.src} className={classes.preview} />
					<TextField
						required
						label="Name"
						type="text"
						name="name"
						margin="normal"
						variant="outlined"
						value={this.state.name}
						onChange={this.handleChange('name')}
					/>
					<TextField
						required
						label="Description"
						type="text"
						margin="normal"
						variant="outlined"
						value={this.state.description}
						onChange={this.handleChange('description')}
						multiline
					/>
					<TextField
						label="Price"
						value={this.state.price}
						onChange={this.handleChange('price')}
						type="number"
						InputLabelProps={{
							shrink: true
						}}
						inputProps={{
							min: 0
						}}
						margin="normal"
						variant="outlined"
						
					/>
					<FormControl>
					<InputLabel htmlFor="select-multiple-checkbox">Categories</InputLabel>
					<Select
						multiple
						value={this.state.selectedCategories}
						onChange={this.handleChange('selectedCategories')}
						input={<Input id="select-multiple-checkbox" />}
						renderValue={selected => selected.join(', ')}
						MenuProps={MenuProps}
					>
						{this.state.categories.map(o => (
						<MenuItem key={o.id} value={o.name}>
							<Checkbox checked={this.state.selectedCategories.indexOf(o.name) > -1} />
							<ListItemText primary={o.name} />
						</MenuItem>
						))}
					</Select>
					</FormControl>
					<FormControlLabel
						control={
							<Switch
							checked={this.state.available}
							onChange={this.handleCheckChange('available')}
							value="available"
							/>
						}
						label="Available"
					/>
					<FormControlLabel
						control={
							<Switch
							checked={this.state.hasSpecialInstruction}
							onChange={this.handleCheckChange('hasSpecialInstruction')}
							value="hasSpecialInstruction"
							/>
						}
						label="Include Special Instruction"
					/>
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
				<Button disabled={loading} color="primary" onClick={ async () => {
					let error = this.validate();
					if(error) {
						this.setState({error});
						return;
					}
					let variables = {
						name: this.state.name,
						description: this.state.description,
						price: this.state.price * 100,
						categories: this.state.selectedCategories,
						available: this.state.available,
						hasSpecialInstruction: this.state.hasSpecialInstruction,
					}
					if(this.state.file) {
						let result = await client.mutate({mutation: SINGLE_UPLOAD, variables:{file: this.state.file}});
						variables.thumbnail = result.data.singleUpload.id
					}
					createMenuItem({variables})
				}}>Add</Button>
				</DialogActions>
			</Dialog>
			{ this.state.open && <CroppingDialog src={this.state.src} file={this.state.file} handleClose={this.handleClose} />}
			</div>
			}}
			</Mutation>
		)
	}
}

export default withStyles(styles)(withRouter(withApollo(AddMenuItem)));