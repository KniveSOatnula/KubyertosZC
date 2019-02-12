import React from 'react';
import SimpleTable from './simple-table';
import {Grid, TextField, Button, TableBody, TableRow, TableCell, 
FormControlLabel, Switch, Fab, Menu, MenuItem} from '@material-ui/core';
import {withRouter, Route} from 'react-router-dom';
import AddCategory from './add-category';
import EditCategory from './edit-category';
import { Query } from "react-apollo";
import { CATEGORIES, UPDATE_CATEGORY } from '../queries';
import NavigationIcon from '@material-ui/icons/Navigation';
import YesNoDialog from './yes-no-dialog';
import ExtendedRoute from './extended-route';

class ManageCategories extends React.Component {
	
	state = {
		search: '',
		includeInactive: false,
		anchorEl: null,
		id: ''
	}

	handleChange = name => event => {
		this.setState({
			[name]: event.target.value,
		});
	};

	handleClick = id => event => {
		this.setState({ anchorEl: event.currentTarget, id });
	};

	handleCheckChange = name => event => {
		this.setState({ [name]: event.target.checked });
	};

	handleClose = () => {
		this.setState({ anchorEl: null, id: '' });
	};

	render() {
		const {history} = this.props;
		const { anchorEl } = this.state;
		return (
			<div>
				<Grid
					container
					direction="row"
					justify="space-between"
					alignItems="center"
				>
					<Grid container item xs={6} justify="flex-start">
					<TextField
						label="Filter By Name"
						type="search"
						margin="normal"
						variant="outlined"
						onChange={this.handleChange('search')}
					/>
					<FormControlLabel style={{marginLeft: 16}}
					control={
						<Switch
							checked={this.state.includeInactive}
							onChange={this.handleCheckChange('includeInactive')}
							value="includeInactive"
						/>
					}
					label="Include Deactivated Categories"
					/>
					</Grid>
					<Grid container item xs={6} justify="flex-end">
						<Button variant="contained" color="primary" onClick={() => history.push('/admin/managecategories/add') }>Add Category</Button>
					</Grid>
				</Grid>
				<Query query={CATEGORIES}>
					{({ loading, error, data }) => {
						if (loading) return '';
						if (error) return '';
						let categories = data.categories;
						if(!this.state.includeInactive) {
							categories = categories.filter((o) => o.isActive === true);
						}
						if(this.state.search) {
							categories = categories.filter((d) => d.name.toLowerCase().includes(this.state.search.toLowerCase()))
						}
						let tableRow = (
							<TableRow>
								<TableCell>Name</TableCell>
								<TableCell>isActive</TableCell>
								<TableCell>Actions</TableCell>
							</TableRow>
						)
						let tableBody = (<TableBody>
						{categories.map(row => {
							return (
							<TableRow key={row.id}>
								<TableCell component="th" scope="row">
								{row.name}
								</TableCell>
								<TableCell>{row.isActive ? "YES":"NO"}</TableCell>
								<TableCell>
									<Fab color="secondary" 
										aria-owns={anchorEl ? row.id : undefined}
										aria-haspopup="true"
										onClick={this.handleClick(row.id)}>
										<NavigationIcon/>
									</Fab>
									<Menu
										id={row.id}
										anchorEl={anchorEl}
										open={Boolean(anchorEl) && this.state.id === row.id}
										onClose={this.handleClose}
										>
										<MenuItem onClick={() => {
											this.handleClose();
											history.push(`/admin/managecategories/edit/${row.id}`);
										}}>Edit</MenuItem>
										<MenuItem onClick={() => {
											this.handleClose();
											history.push(`/admin/managecategories/${row.isActive ? 'deactivate':'activate'}/${row.id}`);
										}}>{row.isActive ? 'Deactivate':'Activate'}</MenuItem>
									</Menu>
								</TableCell>
							</TableRow>
							);
						})}
						</TableBody>)
						return <SimpleTable tableRow={tableRow} tableBody={tableBody}/>
					}}
				</Query>
				<Route path="/admin/managecategories/add" component={AddCategory} />
				<Route path="/admin/managecategories/edit/:id" component={EditCategory} />
				<ExtendedRoute path="/admin/managecategories/activate/:id" component={YesNoDialog}
					componentProps={{
						title: 'Are you sure to activate this category?',
						mutation: UPDATE_CATEGORY,
						variables: {isActive: true}
					}}
				/>
				<ExtendedRoute path="/admin/managecategories/deactivate/:id" component={YesNoDialog}
					componentProps={{
						title: 'Are you sure to deactivate this category?',
						mutation: UPDATE_CATEGORY,
						variables: {isActive: false}
					}}
				/>
			</div>
		)
	}
}

export default withRouter(ManageCategories)