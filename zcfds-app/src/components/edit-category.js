import React from 'react'
import { Mutation, withApollo } from "react-apollo";
import {FormControl, FormHelperText, FormGroup, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle} from '@material-ui/core';
import {withRouter} from 'react-router-dom';
import {UPDATE_CATEGORY, GET_CATEGORY} from '../queries'


class UpdateCategory extends React.Component {
	
	state = {
		id: "",
		name: "",
		error: ""
	}

	async componentDidMount() {
		const { client, match } = this.props;
		let { data: {category} } = await client.query({query: GET_CATEGORY, variables: {id: match.params.id}});
		this.setState({
			id: category.id,
			name: category.name,
		})
	}

	handleChange = name => event => {
		this.setState({
			[name]: event.target.value,
		});
	};

	render() {
		const {history} = this.props;
		return (
			<Mutation mutation={UPDATE_CATEGORY}>
			{(updateCategory, { data, error }) => {
				if(data) {
					history.goBack();
				}
				return <div><Dialog
				open={true}
				aria-labelledby="form-dialog-title"
			>
				<DialogTitle id="form-dialog-title">Update Category</DialogTitle>
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
				<Button color="primary" onClick={async () => {
					if(this.state.name === "") {
						this.setState({error:"Name is required."});
						return;
					}
					let variables = {
						id: this.state.id,
						name: this.state.name,
					}
					updateCategory({variables});
					}}>Update</Button>
				</DialogActions>
				</Dialog>
				</div>
			}}
			</Mutation>
		)
	}
}

export default withApollo(withRouter(UpdateCategory));