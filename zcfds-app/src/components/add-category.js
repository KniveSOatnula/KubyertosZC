import React from 'react'
import { Mutation } from "react-apollo";
import {FormControl, FormHelperText, FormGroup, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle} from '@material-ui/core';
import {withRouter} from 'react-router-dom';
import { CREATE_CATEGORY, CATEGORIES } from '../queries'

class AddCategory extends React.Component {
	
	state = {
		name: "",
		error: ""
	}

	handleChange = name => event => {
		this.setState({
			[name]: event.target.value,
		});
	};

	render() {
		const {history} = this.props;
		return (
			<Mutation mutation={CREATE_CATEGORY} 
				update={(cache, { data: { createCategory } }) => {
					const { categories } = cache.readQuery({ query: CATEGORIES });
					cache.writeQuery({
						query: CATEGORIES,
						data: { categories: categories.concat([createCategory]) }
					});
				}}
			>
			{(createCategory, { data, error, loading }) => {
				if(data) {
					history.goBack();
				}
				return <div><Dialog
				open={true}
				aria-labelledby="form-dialog-title"
			>
				<DialogTitle id="form-dialog-title">Create Food Category</DialogTitle>
				<DialogContent>
				<FormControl fullWidth required error={Boolean(error) || Boolean(this.state.error)} component="fieldset">
					<FormGroup>
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
				<Button color="primary" disabled={loading} onClick={ async () => {
					if(this.state.name === "") {
						 this.setState({error:"Name is required."});
						 return;
					}
					let variables = {
						name: this.state.name
					}
					createCategory({variables})
				}}>Add</Button>
				</DialogActions>
			</Dialog>
			</div>
			}}
			</Mutation>
		)
	}
}

export default withRouter(AddCategory);