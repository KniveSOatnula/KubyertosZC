import React from 'react';
import SimpleTable from './simple-table';
import {Grid, TextField, Button, TableBody, TableRow, TableCell, FormControlLabel, Switch,
Fab, Menu, MenuItem} from '@material-ui/core';
import {withRouter, Route} from 'react-router-dom';
import AddPersonnel from './add-personnel';
import EditPersonnel from './edit-personnel';
import YesNoDialog from './yes-no-dialog';
import { Query } from "react-apollo";
import { DELIVERY_PERSONNELS, UPDATE_USER } from '../queries';
import NavigationIcon from '@material-ui/icons/Navigation';
import ExtendedRoute from './extended-route';
import AdminChangePassword from './admin-change-password';

class ManagePersonnels extends React.Component {
	
	state = {
		search: '',
		includeInactive: false,
		anchorEl: null,
		id: ''
	}

	handleClick = id => event => {
		this.setState({ anchorEl: event.currentTarget, id });
	};

	handleChange = name => event => {
		this.setState({
			[name]: event.target.value,
		});
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
					label="Include Deactivated Personnels"
					/>
					</Grid>
					<Grid container item xs={6} justify="flex-end">
						<Button variant="contained" color="primary" onClick={() => history.push('/admin/managepersonnels/add') }>Add Delivery Personnel</Button>
					</Grid>
				</Grid>
				<Query query={DELIVERY_PERSONNELS}>
					{({ loading, error, data }) => {
						if (loading) return '';
						if (error) return '';
						let deliveryPersonnels = data.deliveryPersonnels;
						if(!this.state.includeInactive) {
							deliveryPersonnels = deliveryPersonnels.filter((d) => d.isActive === true);
						}
						if(this.state.search) {
							deliveryPersonnels = deliveryPersonnels.filter((d) => 
								d.firstname.toLowerCase().includes(this.state.search.toLowerCase()) || 
								d.lastname.toLowerCase().includes(this.state.search.toLowerCase()))
						}
						let tableRow = (
							<TableRow>
								<TableCell>Email</TableCell>
								<TableCell>Picture</TableCell>
								<TableCell>Firstname</TableCell>
								<TableCell>Lastname</TableCell>
								<TableCell>Phone Number</TableCell>
								<TableCell>Plate Number</TableCell>
								<TableCell>Assigned Restaurant</TableCell>
								<TableCell>isActive</TableCell>
								<TableCell>Actions</TableCell>
							</TableRow>
						)
						let tableBody = (<TableBody>
						{deliveryPersonnels.map(row => {
							return (
							<TableRow key={row.id}>
								<TableCell component="th" scope="row">
								{row.email}
								</TableCell>
								<TableCell>
									{ row.profilePicture && <img alt="" src={row.profilePicture.url} style={{width: 100, height: 100}}/>}
								</TableCell>
								<TableCell>{row.firstname}</TableCell>
								<TableCell>{row.lastname}</TableCell>
								<TableCell>{row.phoneNumber}</TableCell>
								<TableCell>{row.plateNumber}</TableCell>
								<TableCell>{row.assignRestaurants.map(o => o.restaurant.name).join(', ')}</TableCell>
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
											history.push(`/admin/managepersonnels/edit/${row.id}`);
										}}>Edit</MenuItem>
										<MenuItem onClick={() => {
											this.handleClose();
											history.push(`/admin/managepersonnels/changepassword/${row.id}`);
										}}>Change Password</MenuItem>
										<MenuItem onClick={() => {
											this.handleClose();
											history.push(`/admin/managepersonnels/${row.isActive ? 'deactivate':'activate'}/${row.id}`);
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
				<Route path="/admin/managepersonnels/add" component={AddPersonnel} />
				<Route path="/admin/managepersonnels/edit/:id" component={EditPersonnel} />
				<Route path="/admin/managepersonnels/changepassword/:id" component={AdminChangePassword} />
				<ExtendedRoute path="/admin/managepersonnels/activate/:id" component={YesNoDialog}
					componentProps={{
						title: 'Are you sure to activate this account?',
						mutation: UPDATE_USER,
						variables: {isActive: true}
					}}
				/>
				<ExtendedRoute path="/admin/managepersonnels/deactivate/:id" component={YesNoDialog}
					componentProps={{
						title: 'Are you sure to deactivate this account?',
						mutation: UPDATE_USER,
						variables: {isActive: false}
					}}
				/>
			</div>
		)
	}
}

export default withRouter(ManagePersonnels)