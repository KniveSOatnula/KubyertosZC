import React from 'react';
import SimpleTable from './simple-table';
import {Grid, TextField, Button, TableBody, TableRow, TableCell, Menu, MenuItem, Fab, FormControlLabel, Switch} from '@material-ui/core';
import {withRouter, Route} from 'react-router-dom';
import AddRestaurant from './add-restaurant';
import EditRestaurant from './edit-restaurant';
import AdminChangePassword from './admin-change-password';
import YesNoDialog from './yes-no-dialog';
import { Query } from "react-apollo";
import { RESTAURANTS, UPDATE_USER } from '../queries';
import NavigationIcon from '@material-ui/icons/Navigation';
import ExtendedRoute from './extended-route';

class ManageRestaurant extends React.Component {
	
	state = {
		search: '',
		anchorEl: null,
		includeInactive: false,
		id: ''
	}

	handleClick = id => event => {
		this.setState({ anchorEl: event.currentTarget, id });
	};
	
	handleClose = () => {
		this.setState({ anchorEl: null, id: '' });
	};

	handleChange = name => event => {
		this.setState({
			[name]: event.target.value,
		});
	};

	handleCheckChange = name => event => {
		this.setState({ [name]: event.target.checked });
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
					label="Include Deactivated Restaurants"
					/>
					</Grid>
					<Grid container item xs={6} justify="flex-end">
						<Button variant="contained" color="primary" onClick={() => history.push('/admin/managerestaurants/add') }>Add Restaurant</Button>
					</Grid>
				</Grid>
				<Query query={RESTAURANTS}>
					{({ loading, error, data }) => {
						if (loading) return '';
						if (error) return '';
						let restaurants = data.restaurants;
						if(!this.state.includeInactive) {
							restaurants = restaurants.filter((r) => r.isActive === true);
						}
						if(this.state.search) {
							restaurants = restaurants.filter((r) => 
								r.restaurant.name.toLowerCase().includes(this.state.search.toLowerCase()))
						}
						let tableRow = (
							<TableRow>
								<TableCell>Email</TableCell>
								<TableCell>Picture</TableCell>
								<TableCell>Name</TableCell>
								<TableCell>Owner</TableCell>
								<TableCell>Telephone Number</TableCell>
								<TableCell>isActive</TableCell>
								<TableCell>Actions</TableCell>
							</TableRow>
						)
						let tableBody = (<TableBody>
						{restaurants.map(row => {
							return (
							<TableRow key={row.id}>
								<TableCell component="th" scope="row">
								{row.email}
								</TableCell>
								<TableCell>
									{ row.profilePicture && <img alt="" src={row.profilePicture.url} style={{width: 100, height: 100}}/>}
								</TableCell>
								<TableCell>{row.restaurant.name}</TableCell>
								<TableCell>{row.firstname + ' ' + row.lastname }</TableCell>
								<TableCell>{row.restaurant.telephoneNumber}</TableCell>
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
											history.push(`/admin/managerestaurants/edit/${row.id}`);
										}}>Edit</MenuItem>
										<MenuItem onClick={() => {
											this.handleClose();
											history.push(`/admin/managerestaurants/changepassword/${row.id}`);
										}}>Change Password</MenuItem>
										<MenuItem onClick={() => {
											this.handleClose();
											history.push(`/admin/managerestaurants/${row.isActive ? 'deactivate':'activate'}/${row.id}`);
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
				<Route path="/admin/managerestaurants/add" component={AddRestaurant} />
				<Route path="/admin/managerestaurants/edit/:id" component={EditRestaurant} />
				<Route path="/admin/managerestaurants/changepassword/:id" component={AdminChangePassword} />
				<ExtendedRoute path="/admin/managerestaurants/activate/:id" component={YesNoDialog}
					componentProps={{
						title: 'Are you sure to activate this restaurant?',
						mutation: UPDATE_USER,
						variables: {isActive: true}
					}}
				/>
				<ExtendedRoute path="/admin/managerestaurants/deactivate/:id" component={YesNoDialog}
					componentProps={{
						title: 'Are you sure to deactivate this restaurant?',
						mutation: UPDATE_USER,
						variables: {isActive: false}
					}}
				/>
			</div>
		)
	}
}

export default withRouter(ManageRestaurant)